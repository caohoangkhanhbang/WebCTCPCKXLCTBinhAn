using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Business
{
    public class BusinessDuAn(IConnectionService connectionService)
    {
        private readonly IConnectionService _connectionService = connectionService;
        public async Task<object> GetDuAn(string? query, int? lastId, int pageSize = 10)
        {
            List<DuAn> lst = new List<DuAn>();
            string whereClause = "";
            if (!string.IsNullOrEmpty(query))
            {
                whereClause = "and ( @query = '' or ten_du_an ilike @query or noi_dung ilike @query or bo_nghia ilike @query or ten_du_an_ta ilike @query or noi_dung_ta ilike @query or bo_nghia_ta ilike @query )";
            }

            if(lastId.HasValue)
            {
                whereClause += " and (@lastId IS NULL OR id > @lastId)";
            }
            string sql = @"SELECT id, ten_du_an, bo_nghia,
                                    noi_dung, hinh, ten_du_an_ta,
                                    bo_nghia_ta, noi_dung_ta, loai_du_an
                            FROM public.du_an  
                            where  hien_thi = true "+ whereClause + @"
                            ORDER BY id asc LIMIT @limit";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@query", $"%{query}%");
            cmd.Parameters.AddWithValue("@limit", pageSize+1); 
            cmd.Parameters.AddWithValue("@lastId", lastId.HasValue ? (object)lastId.Value : DBNull.Value);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                lst.Add(new DuAn
                {
                    id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                    ten_du_an = reader["ten_du_an"] != DBNull.Value ? reader["ten_du_an"].ToString() : string.Empty,
                    bo_nghia = reader["bo_nghia"] != DBNull.Value ? reader["bo_nghia"].ToString() : string.Empty,
                    noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty,
                    hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                    ten_du_an_ta = reader["ten_du_an_ta"] != DBNull.Value ? reader["ten_du_an_ta"].ToString() : string.Empty,
                    bo_nghia_ta = reader["bo_nghia_ta"] != DBNull.Value ? reader["bo_nghia_ta"].ToString() : string.Empty,
                    noi_dung_ta = reader["noi_dung_ta"] != DBNull.Value ? reader["noi_dung_ta"].ToString() : string.Empty
                });
            }
            bool hasNextPage = lst.Count > pageSize;
            var data = hasNextPage ? lst.Take(pageSize).ToList() : lst;
            int? nextCursor = data?.LastOrDefault().id;
            return new { data, hasNextPage, nextCursor };
        }

        public async Task<DuAn> GetDuAnChiTiet(int id)
        {
            string sql = @"SELECT id, ten_du_an, bo_nghia,
                                    noi_dung, hinh, ten_du_an_ta,
                                    bo_nghia_ta, noi_dung_ta, loai_du_an, created_date,
                            hang_muc_thi_cong, chu_dau_tu, thoi_gian
                            FROM public.du_an 
                            where  hien_thi = true and id = @id 
                            ORDER BY id desc LIMIT 1";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@id", id);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if(await reader.ReadAsync())
            {
                return new DuAn 
                {
                    id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                    ten_du_an = reader["ten_du_an"] != DBNull.Value ? reader["ten_du_an"].ToString() : string.Empty,
                    bo_nghia = reader["bo_nghia"] != DBNull.Value ? reader["bo_nghia"].ToString() : string.Empty,
                    noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty,
                    hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                    ten_du_an_ta = reader["ten_du_an_ta"] != DBNull.Value ? reader["ten_du_an_ta"].ToString() : string.Empty,
                    bo_nghia_ta = reader["bo_nghia_ta"] != DBNull.Value ? reader["bo_nghia_ta"].ToString() : string.Empty,
                    noi_dung_ta = reader["noi_dung_ta"] != DBNull.Value ? reader["noi_dung_ta"].ToString() : string.Empty,
                    ngay_dang = reader["created_date"] != DBNull.Value ? (DateOnly?)reader["created_date"] : null,
                    hang_muc_thi_cong = reader["hang_muc_thi_cong"] != DBNull.Value ? reader["hang_muc_thi_cong"].ToString() : string.Empty,
                    chu_dau_tu = reader["chu_dau_tu"] != DBNull.Value ? reader["chu_dau_tu"].ToString() : string.Empty,
                    thoi_gian = reader["thoi_gian"] != DBNull.Value ? (DateOnly?)reader["thoi_gian"] : null
                };
            }
            return new DuAn();
        }
    }
}

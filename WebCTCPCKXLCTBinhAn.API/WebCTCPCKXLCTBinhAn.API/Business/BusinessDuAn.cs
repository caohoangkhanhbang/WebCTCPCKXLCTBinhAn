using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Business
{
    public class BusinessDuAn(IConnectionService connectionService)
    {
        private readonly IConnectionService _connectionService = connectionService;
        public async Task<List<DuAn>> GetDuAn(string? query)
        {
            List<DuAn> lst = new List<DuAn>();
            string whereClause = "";
            if (!string.IsNullOrEmpty(query))
            {
                whereClause = "and ten_du_an ilike @query or noi_dung ilike @query or bo_nghia ilike @query or ten_du_an_ta ilike @query or noi_dung_ta ilike @query or bo_nghia_ta ilike @query";
            }
            string sql = @"SELECT da.id, ten_du_an, bo_nghia,
                                    noi_dung, hinh, ten_du_an_ta,
                                    bo_nghia_ta, noi_dung_ta, da.loai_du_an
                            FROM public.du_an da    
                            inner join loai_du_an lda on da.loai_du_an = lda.id 
                            where  da.hien_thi = true "+ whereClause + @"
                            ORDER BY da.id desc LIMIT 10";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@query", $"%{query}%");
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
            return lst;
        }

        public async Task<DuAn> GetDuAnChiTiet(int id)
        {
            string sql = @"SELECT da.id, ten_du_an, bo_nghia,
                                    noi_dung, hinh, ten_du_an_ta,
                                    bo_nghia_ta, noi_dung_ta, da.loai_du_an
                            FROM public.du_an da    
                            inner join loai_du_an lda on da.loai_du_an = lda.id 
                            where  da.hien_thi = true and da.id = @id 
                            ORDER BY da.id desc LIMIT 1";
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
                    noi_dung_ta = reader["noi_dung_ta"] != DBNull.Value ? reader["noi_dung_ta"].ToString() : string.Empty
                };
            }
            return new DuAn();
        }
    }
}

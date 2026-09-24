using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public class CacCotMocRepository(NpgsqlDataSource dataSource) :ICacCotMocRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        public async Task<PaginationResponse<CacCotMoc>> GetPagedAsync(int page = 1, int pageSize = 10, string? search = "")
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 10, 100);
            int offset = (page - 1) * pageSize;

            string whereClause = "";
            if(!string.IsNullOrEmpty(search))
            {
                search = search.Trim();
                whereClause += @"
                where
                      noi_dung ILIKE @search     
                      OR thoi_gian ILIKE @search 
                  
                ";
            }

            var result = new PaginationResponse<CacCotMoc>
            {
                Page = page,
                PageSize = pageSize,
            };


            string countSql = $@"SELECT COUNT(*)
                FROM cac_cot_moc {whereClause}";

            await using var cmd = _dataSource.CreateCommand(countSql);
            if(!string.IsNullOrEmpty(search))
            {
                cmd.Parameters.AddWithValue("@search", $"%{search}%");
            };
            var countResult = await cmd.ExecuteScalarAsync();
            result.TotalItems = Convert.ToInt32(countResult);

            //Lấy phân trang
            string dataSql = $@"
            SELECT
                id,
                noi_dung,
                is_delete,
                hien_thi,
                thoi_gian
            FROM cac_cot_moc
            {whereClause}
            ORDER BY id DESC
            LIMIT @pageSize
            OFFSET @offset
            ";
            await using var reader = _dataSource.CreateCommand(dataSql);
            reader.Parameters.AddWithValue("@pageSize", pageSize);
            reader.Parameters.AddWithValue("@offset", offset);
            if (!string.IsNullOrEmpty(search))
            {
                reader.Parameters.AddWithValue("@search", $"%{search}%");
            };
            await using var dataReader = await reader.ExecuteReaderAsync();
            while(await dataReader.ReadAsync())
            {
                result.Items.Add(new CacCotMoc
                {
                    id = dataReader.GetInt32(0),
                    noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(1) : null,
                    is_delete = dataReader["is_delete"] != DBNull.Value ? dataReader.GetBoolean(2) : (bool?)null,
                    hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(3) : (bool?)null,
                    thoi_gian = dataReader["thoi_gian"] != DBNull.Value ? dataReader.GetString(4) : null
                });
            }
            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }
    }
}

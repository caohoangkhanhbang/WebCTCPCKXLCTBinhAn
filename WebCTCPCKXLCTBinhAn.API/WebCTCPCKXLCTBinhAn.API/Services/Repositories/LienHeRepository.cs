using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;
namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class LienHeRepository(NpgsqlDataSource dataSource, IManipulationDB manipulationDB) : ILienHeRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly string tenBang = "lien_he";
        private readonly string dsCot = " id, ten, noi_dung, cccd, email, sdt, created_date, da_xem  ";
        public async Task<PaginationResponse<LienHe>> GetList(int page, int pageSize, string? search = "")
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 10, 100);
            int offset = (page - 1) * pageSize;

            string whereClause = " ";
            if (!string.IsNullOrEmpty(search))
            {
                search = search.Trim();
                whereClause += @"
                      where ten ILIKE @search  
                      OR cccd ILIKE @search
                      OR sdt ILIKE @search
                      OR email ILIKE @search                     
                      OR created_date::text ILIKE @search
                ";
            }

            var result = new PaginationResponse<LienHe>
            {
                Page = page,
                PageSize = pageSize,
            };


            string countSql = $@"SELECT COUNT(*)
                FROM {tenBang} {whereClause}";

            await using var cmd = _dataSource.CreateCommand(countSql);
            if (!string.IsNullOrEmpty(search))
            {
                cmd.Parameters.AddWithValue("@search", $"%{search}%");
            }
            ;
            var countResult = await cmd.ExecuteScalarAsync();
            result.TotalItems = Convert.ToInt32(countResult);

            //Lấy phân trang
            string dataSql = $@"
            SELECT
                {dsCot}
            FROM {tenBang}
            {whereClause}
            order by da_xem asc, created_date desc
            LIMIT @pageSize
            OFFSET @offset
            ";
            await using var reader = _dataSource.CreateCommand(dataSql);
            reader.Parameters.AddWithValue("@pageSize", pageSize);
            reader.Parameters.AddWithValue("@offset", offset);
            if (!string.IsNullOrEmpty(search))
            {
                reader.Parameters.AddWithValue("@search", $"%{search}%");
            }
            ;
            await using var dataReader = await reader.ExecuteReaderAsync();
            while (await dataReader.ReadAsync())
            {
                result.Items.Add(new LienHe
                {
                    id = dataReader.GetInt32(0),
                    ten = dataReader["ten"] != DBNull.Value ? dataReader.GetString(1) : null,
                    noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(2) : null,
                    cccd = dataReader["cccd"] != DBNull.Value ? dataReader.GetString(3) : null,
                    email = dataReader["email"] != DBNull.Value ? dataReader.GetString(4) : null,
                    sdt = dataReader["sdt"] != DBNull.Value ? dataReader.GetString(5) : null,
                    created_date = dataReader["created_date"] != DBNull.Value ? dataReader.GetDateTime(6) : (DateTime?)null,
                    da_xem = dataReader["da_xem"] != DBNull.Value ? dataReader.GetBoolean(7) : (bool?)null
                });
            }

            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }

        public async Task<bool> Update(int id, LienHe data)
        {
            var dataToUpdate = new Dictionary<string, object?>
            {
                ["da_xem"] = data.da_xem
            };

            var whereConditions = new Dictionary<string, object?>
            {
                ["id"] = id
            };
            var result = await _manipulationDB.UpdateDynamicAsync(
                tenBang,
                dataToUpdate,
                whereConditions
            );

            return result;
        }

        public async Task<bool> Delete(int id)
        {
            var whereConditions = new Dictionary<string, object?>
            {
                ["id"] = id
            };
            var result = await _manipulationDB.DeleteDynamicAsync(
                tenBang,
                whereConditions
            );
            return result;
        }
    }
}

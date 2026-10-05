using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class UngTuyenRespository(NpgsqlDataSource dataSource, IManipulationDB manipulationDB) : IUngTuyenRespository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly string tenBang = " ung_tuyen ut inner join tuyen_dung td on ut.id_tuyen_dung = td.id ";
        private readonly string dsCot = " ut.id, id_tuyen_dung, ten, email, sdt, filecv, ut.created_date, ten_cong_viec, da_xem ";
        public async Task<PaginationResponse<UngTuyen>> GetList(int page, int pageSize, string? search = "")
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
                      OR email ILIKE @search
                      OR sdt ILIKE @search
                      OR ten_cong_viec ILIKE @search
                ";
            }

            var result = new PaginationResponse<UngTuyen>
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
            order by da_xem asc, ngay_kt_tuyen desc
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
                result.Items.Add(new UngTuyen
                {
                    id = dataReader.GetInt32(0),
                    id_tuyen_dung = dataReader.GetInt32(1),
                    ten = dataReader["ten"] != DBNull.Value ? dataReader.GetString(2) : null,
                    email = dataReader["email"] != DBNull.Value ? dataReader.GetString(3) : null,
                    sdt = dataReader["sdt"] != DBNull.Value ? dataReader.GetString(4) : null,
                    filecv = dataReader["filecv"] != DBNull.Value ? dataReader.GetString(5) : null,
                    created_date = dataReader["created_date"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(6)) : (DateOnly?)null,
                    ten_cong_viec = dataReader["ten_cong_viec"] != DBNull.Value ? dataReader.GetString(7) : null,
                    da_xem = dataReader["da_xem"] != DBNull.Value ? dataReader.GetBoolean(8) : (bool?)null
                });
            }

            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }

        public async Task<bool> Update(int id, UngTuyen data)
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
                "ung_tuyen",
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
                "ung_tuyen",
                whereConditions
            );
            return result;
        }
    }
}

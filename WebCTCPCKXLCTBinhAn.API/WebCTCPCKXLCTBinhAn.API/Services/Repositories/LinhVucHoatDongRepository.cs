using Npgsql;
using System.Data;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class LinhVucHoatDongRepository(NpgsqlDataSource dataSource, IManipulationDB manipulationDB, IFileService fileService) : ILinhVucHoatDongRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly IFileService _fileService = fileService;
        public async Task<PaginationResponse<GiaiPhap>> GetPagedAsync(int page, int pageSize, string? search = "")
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 10, 100);
            int offset = (page - 1) * pageSize;

            string whereClause = "";
            if (!string.IsNullOrEmpty(search))
            {
                search = search.Trim();
                whereClause += @"
                where
                      noi_dung ILIKE @search  
                      OR giai_phap ILIKE @search
                ";
            }

            var result = new PaginationResponse<GiaiPhap>
            {
                Page = page,
                PageSize = pageSize,
            };


            string countSql = $@"SELECT COUNT(*)
                FROM giai_phap {whereClause}";

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
                id,
                noi_dung,
                giai_phap,
                hinh,
                hien_thi
            FROM giai_phap
            {whereClause}
            ORDER BY id desc
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
                result.Items.Add(new GiaiPhap
                {
                    id = dataReader.GetInt32(0),
                    noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(1) : null,
                    giai_phap = dataReader["giai_phap"] != DBNull.Value ? dataReader.GetString(2) : null,
                    hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(3) : null,
                    hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(4) : (bool?)null
                });
            }
            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }

        public async Task<GiaiPhap?> GetById(int id)
        {
            const string sql = """
                                SELECT id, noi_dung, giai_phap, hien_thi, hinh
                                FROM giai_phap
                                WHERE id = @id
                                LIMIT 1;
                                """;

            await using var cmd = _dataSource.CreateCommand(sql);
            cmd.Parameters.AddWithValue("@id", id);
            await using var reader = await cmd.ExecuteReaderAsync(
                CommandBehavior.SingleRow
            );

            if (!await reader.ReadAsync())
                return null;

            return new GiaiPhap
            {
                id = reader.GetInt32(0),
                noi_dung = reader.IsDBNull(1) ? null : reader.GetString(1),
                giai_phap = reader.IsDBNull(2) ? null : reader.GetString(2),
                hien_thi = reader.IsDBNull(3) ? null : reader.GetBoolean(3),
                hinh = reader.IsDBNull(4) ? null : reader.GetString(4)
            };
        }

        public async Task<bool> Insert(GiaiPhap data)
        {
            if (data.file != null && data.file.Length > 0)
            {
                data.hinh = await _fileService.SaveFileAsync(data.file, $"GiaiPhap/{DateTime.Now:yyyy/MM/dd}");
            }

            var dataToInsert = new Dictionary<string, object?>
            {
                ["noi_dung"] = data.noi_dung,
                ["giai_phap"] = data.giai_phap,
                ["hien_thi"] = data.hien_thi,
                ["hinh"] = data.hinh,
                ["created_date"] = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            return await _manipulationDB.InsertDynamicAsync(
                "giai_phap",
                dataToInsert
            );
        }

        public async Task<bool> Update(int id, GiaiPhap data)
        {
            if (data.file != null && data.file.Length > 0)
            {
                data.hinh = await _fileService.SaveFileAsync(data.file, $"GiaiPhap/{DateTime.Now:yyyy/MM/dd}");
            }
            var dataToUpdate = new Dictionary<string, object?>
            {
                ["noi_dung"] = data.noi_dung,
                ["giai_phap"] = data.giai_phap,
                ["hien_thi"] = data.hien_thi,
                ["hinh"] = data.hinh,
            };
            var whereConditions = new Dictionary<string, object?>
            {
                ["id"] = id
            };
            return await _manipulationDB.UpdateDynamicAsync(
                "giai_phap",
                dataToUpdate,
                whereConditions
            );
        }

        public async Task<bool> Delete(int id)
        {
            var whereConditions = new Dictionary<string, object?>
            {
                ["id"] = id
            };
            return await _manipulationDB.DeleteDynamicAsync(
                "giai_phap",
                whereConditions
            );
        }
    }
}

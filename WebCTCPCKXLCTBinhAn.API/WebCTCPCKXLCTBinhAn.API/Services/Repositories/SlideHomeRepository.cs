using Npgsql;
using System.Data;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class SlideHomeRepository(NpgsqlDataSource dataSource, IManipulationDB manipulationDB, IFileService fileService) : ISlideHomeRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly IFileService _fileService = fileService;
        private readonly string tenBang = "slide_home";
        private readonly string tenCot = "hinh";
        private readonly string dsCot = " id, hinh, noi_dung, bo_nghia, hien_thi ";

        public async Task<PaginationResponse<SlideHome>> GetPagedAsync(int page, int pageSize, string? search = "")
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
                      bo_nghia ILIKE @search
                      OR noi_dung ILIKE @search
                ";
            }

            var result = new PaginationResponse<SlideHome>
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
                result.Items.Add(new SlideHome
                {
                    id = dataReader.GetInt32(0),
                    hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(1) : null,
                    noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(2) : null,
                    bo_nghia = dataReader["bo_nghia"] != DBNull.Value ? dataReader.GetString(3) : null,
                    hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(4) : (bool?)null,

                });
            }
            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }

        public async Task<SlideHome?> GetById(int id)
        {
            string sql = $@"
                                SELECT {dsCot}
                                FROM {tenBang}
                                WHERE id = @id
                                LIMIT 1;
                                ";

            await using var cmd = _dataSource.CreateCommand(sql);
            cmd.Parameters.AddWithValue("@id", id);
            await using var dataReader = await cmd.ExecuteReaderAsync(
                CommandBehavior.SingleRow
            );

            if (!await dataReader.ReadAsync())
                return null;

            return new SlideHome
            {
                id = dataReader.GetInt32(0),
                hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(1) : null,
                noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(2) : null,
                bo_nghia = dataReader["bo_nghia"] != DBNull.Value ? dataReader.GetString(3) : null,
                hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(4) : (bool?)null,
            };
        }

        public async Task<bool> Insert(SlideHome data, IFormFile? file)
        {
            if (file != null && file.Length > 0)
            {
                data.hinh = await _fileService.SaveFileAsync(file, $"SlideHome/{DateTime.Now:yyyy/MM/dd}");
            }

            var dataToInsert = new Dictionary<string, object?>
            {
                ["bo_nghia"] = data.bo_nghia,
                ["noi_dung"] = data.noi_dung,
                ["hinh"] = data.hinh,
                ["hien_thi"] = data.hien_thi,
            };
            return await _manipulationDB.InsertDynamicAsync(
                tenBang,
                dataToInsert
            );
        }

        public async Task<bool> Update(int id, SlideHome data, IFormFile? file)
        {
            string fileOld = _fileService.GetFileName(tenBang, tenCot, id);
            string fileNew = "";
            if (file != null && file.Length > 0)
            {
                fileNew = data.hinh = await _fileService.SaveFileAsync(file, $"SlideHome/{DateTime.Now:yyyy/MM/dd}");
            }
            var dataToUpdate = new Dictionary<string, object?>
            {
                ["bo_nghia"] = data.bo_nghia,
                ["noi_dung"] = data.noi_dung,
                ["hien_thi"] = data.hien_thi
            };
            if (data.hinh != null)
                dataToUpdate.Add(tenCot, data.hinh);
            var whereConditions = new Dictionary<string, object?>
            {
                ["id"] = id
            };
            var result = await _manipulationDB.UpdateDynamicAsync(
                tenBang,
                dataToUpdate,
                whereConditions
            );
            if (!result) deleteFile(fileNew);
            else if (!string.IsNullOrEmpty(fileNew)) deleteFile(fileOld);
            return result;
        }

        public async Task<bool> Delete(int id)
        {
            string fileOld = _fileService.GetFileName(tenBang, tenCot, id);
            var whereConditions = new Dictionary<string, object?>
            {
                ["id"] = id
            };
            var result = await _manipulationDB.DeleteDynamicAsync(
                tenBang,
                whereConditions
            );
            if (result) deleteFile(fileOld);
            return result;
        }

        public void deleteFile(string fileName)
        {
            if (!string.IsNullOrWhiteSpace(fileName))
                _fileService.DeleteFile(fileName);
        }
    }
}

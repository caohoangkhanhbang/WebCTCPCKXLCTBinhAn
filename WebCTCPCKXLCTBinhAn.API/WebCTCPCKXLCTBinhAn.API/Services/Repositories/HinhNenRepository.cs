using Npgsql;
using System.Data;
using System.Text.RegularExpressions;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class HinhNenRepository(NpgsqlDataSource dataSource, IManipulationDB manipulationDB, IFileService fileService) : IHinhNenRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly IFileService _fileService = fileService;
        private readonly string tenBang = "hinh_nen";
        private readonly string joinTable = "hinh_nen hn left join loai_trang lt on hn.id_loai_trang = lt.id";
        private readonly string tenCot = "hinh";
        private readonly string dsCot = " hn.id, id_loai_trang, ten_trang, hinh, hien_thi ";

        public async Task<PaginationResponse<HinhNen>> GetPagedAsync(int page, int pageSize, string? search = "")
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
                      ten_trang ILIKE @search
                ";
            }

            var result = new PaginationResponse<HinhNen>
            {
                Page = page,
                PageSize = pageSize,
            };


            string countSql = $@"SELECT COUNT(*)
                FROM {joinTable} {whereClause}";

            await using var cmd = _dataSource.CreateCommand(countSql);
            if (!string.IsNullOrEmpty(search))
            {
                cmd.Parameters.AddWithValue("@search", $"%{search}%");
            }
            var countResult = await cmd.ExecuteScalarAsync();
            result.TotalItems = Convert.ToInt32(countResult);

            //Lấy phân trang
            string dataSql = $@"
            SELECT
                {dsCot}
            FROM {joinTable}
            {whereClause}
            ORDER BY id_loai_trang desc
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
                result.Items.Add(new HinhNen
                {
                    id = dataReader.GetInt32(0),
                    id_loai_trang = dataReader["id_loai_trang"] != DBNull.Value ? dataReader.GetInt32(1) : (int?)null,
                    ten_trang = dataReader["ten_trang"] != DBNull.Value ? dataReader.GetString(2) : null,
                    hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(3) : null,
                    hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(4) : (bool?)null,
                });
            }
            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }

        public async Task<HinhNen?> GetById(int id)
        {
            string sql = $@"
                                SELECT {dsCot}
                                FROM {joinTable}
                                WHERE hn.id = @id
                                LIMIT 1;
                                ";

            await using var cmd = _dataSource.CreateCommand(sql);
            cmd.Parameters.AddWithValue("@id", id);
            await using var dataReader = await cmd.ExecuteReaderAsync(
                CommandBehavior.SingleRow
            );

            if (!await dataReader.ReadAsync())
                return null;

            return new HinhNen
            {
                id = dataReader.GetInt32(0),
                id_loai_trang = dataReader["id_loai_trang"] != DBNull.Value ? dataReader.GetInt32(1) : (int?)null,
                ten_trang = dataReader["ten_trang"] != DBNull.Value ? dataReader.GetString(2) : null,
                hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(3) : null,
                hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(4) : (bool?)null,
            };
        }

        public async Task<bool> Insert(HinhNen data, List<IFormFile>? files)
        {
            bool results = false;
            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    try
                    {
                        string imagePath = "";
                        if (file != null && file.Length > 0)
                        {
                            imagePath = await _fileService.SaveFileAsync(file, $"HinhNen/{DateTime.Now:yyyy/MM/dd}");
                        }
                        var dataToInsert = new Dictionary<string, object?>
                        {
                            ["id_loai_trang"] = data.id_loai_trang,
                            ["hien_thi"] = data.hien_thi,
                        };
                        if (!string.IsNullOrWhiteSpace(imagePath))
                            dataToInsert.Add("hinh", imagePath);
                        results = await _manipulationDB.InsertDynamicAsync(
                            tenBang,
                            dataToInsert
                        );
                        if (!results) deleteFile(imagePath);
                    }
                    catch
                    {
                        return false;
                    }
                }
            }
            return results;
        }

        public async Task<bool> Update(int id, HinhNen data, IFormFile? file)
        {
            string fileOld = "";
            string fileNew = "";
            if (file != null && file.Length > 0)
            {
                fileNew = data.hinh = await _fileService.SaveFileAsync(file, $"HinhNen/{DateTime.Now:yyyy/MM/dd}");
                fileOld = GetFileName(tenBang, tenCot, id, "id_loai_trang", data.id_loai_trang);
            }
            var dataToUpdate = new Dictionary<string, object?>
            {
                ["id_loai_trang"] = data.id_loai_trang,
                ["hien_thi"] = data.hien_thi,
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
            if (!result) if (!String.IsNullOrWhiteSpace(fileNew)) deleteFile(fileNew);
            else
            {
                if (!String.IsNullOrWhiteSpace(fileOld)) deleteFile(fileOld); //toàn bộ
            }
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

        public string GetFileName(string tenBang, string tenCot, int id, string tenCotDK, int? foriegnId)
        {
            if (string.IsNullOrWhiteSpace(tenBang) || string.IsNullOrWhiteSpace(tenCot) || id == null)
                return null;
            if (!Regex.IsMatch(tenBang, @"^[a-zA-Z_][a-zA-Z0-9_]*$") || !Regex.IsMatch(tenCot, @"^[a-zA-Z_][a-zA-Z0-9_]*$"))
                throw new ArgumentException("Tên bảng hoặc tên cột không hợp lệ.");
            string sql = @$"
            select {tenCot} from {tenBang} where id = @id and {tenCotDK} = @foriegnId limit 1
            ";
            var cmd = dataSource.CreateCommand(sql);
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("foriegnId", foriegnId);
            var result = cmd.ExecuteScalar();
            return result?.ToString() ?? "";
        }
    }
}

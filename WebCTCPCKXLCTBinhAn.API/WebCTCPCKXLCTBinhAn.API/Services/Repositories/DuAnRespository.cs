using Npgsql;
using System.Data;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class DuAnRespository(NpgsqlDataSource dataSource, IManipulationDB manipulationDB, IFileService fileService) : IDuAnRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly IFileService _fileService = fileService;
        private readonly string tenBang = "du_an";
        private readonly string tenCot = "hinh";
        private readonly string dsCot = " id, ten_du_an, bo_nghia, noi_dung, hinh, hien_thi, hang_muc_thi_cong, chu_dau_tu, thoi_gian ";

        public async Task<PaginationResponse<DuAn>> GetPagedAsync(int page, int pageSize, string? search = "")
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
                      ten_du_an ILIKE @search  
                      OR bo_nghia ILIKE @search
                      OR noi_dung ILIKE @search
                      OR hang_muc_thi_cong ILIKE @search
                      OR chu_dau_tu ILIKE @search
                      OR thoi_gian::text ILIKE @search
                ";
            }

            var result = new PaginationResponse<DuAn>
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
                result.Items.Add(new DuAn
                {
                    id = dataReader.GetInt32(0),
                    ten_du_an = dataReader["ten_du_an"] != DBNull.Value ? dataReader.GetString(1) : null,
                    bo_nghia = dataReader["bo_nghia"] != DBNull.Value ? dataReader.GetString(2) : null,
                    noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(3) : null,
                    hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(4) : null,
                    hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(5) : (bool?)null,
                    hang_muc_thi_cong = dataReader["hang_muc_thi_cong"] != DBNull.Value ? dataReader.GetString(6) : null,
                    chu_dau_tu = dataReader["chu_dau_tu"] != DBNull.Value ? dataReader.GetString(7) : null,
                    thoi_gian = dataReader["thoi_gian"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(8)) : (DateOnly?)null
                });
            }
            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }

        public async Task<DuAn?> GetById(int id)
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

            return new DuAn
            {
                id = dataReader.GetInt32(0),
                ten_du_an = dataReader["ten_du_an"] != DBNull.Value ? dataReader.GetString(1) : null,
                bo_nghia = dataReader["bo_nghia"] != DBNull.Value ? dataReader.GetString(2) : null,
                noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(3) : null,
                hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(4) : null,
                hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(5) : (bool?)null,
                hang_muc_thi_cong = dataReader["hang_muc_thi_cong"] != DBNull.Value ? dataReader.GetString(6) : null,
                chu_dau_tu = dataReader["chu_dau_tu"] != DBNull.Value ? dataReader.GetString(7) : null,
                thoi_gian = dataReader["thoi_gian"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(8)) : (DateOnly?)null
            };
        }

        public async Task<bool> Insert(DuAn data)
        {
            if (data.file != null && data.file.Length > 0)
            {
                data.hinh = await _fileService.SaveFileAsync(data.file, $"DuAn/{DateTime.Now:yyyy/MM/dd}");
            }

            var dataToInsert = new Dictionary<string, object?>
            {
                ["ten_du_an"] = data.ten_du_an,
                ["bo_nghia"] = data.bo_nghia,
                ["noi_dung"] = data.noi_dung,
                ["hinh"] = data.hinh,
                ["hien_thi"] = data.hien_thi,
                ["hang_muc_thi_cong"] = data.hang_muc_thi_cong,
                ["chu_dau_tu"] = data.chu_dau_tu,
                ["thoi_gian"] = data.thoi_gian,
                ["created_date"] = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            return await _manipulationDB.InsertDynamicAsync(
                tenBang,
                dataToInsert
            );
        }

        public async Task<bool> Update(int id, DuAn data)
        {
            string fileOld = _fileService.GetFileName(tenBang, tenCot, id);
            string fileNew = "";
            if (data.file != null && data.file.Length > 0)
            {
                fileNew = data.hinh = await _fileService.SaveFileAsync(data.file, $"DuAn/{DateTime.Now:yyyy/MM/dd}");
            }
            var dataToUpdate = new Dictionary<string, object?>
            {
                ["ten_du_an"] = data.ten_du_an,
                ["bo_nghia"] = data.bo_nghia,
                ["noi_dung"] = data.noi_dung,
                ["hien_thi"] = data.hien_thi,
                ["hang_muc_thi_cong"] = data.hang_muc_thi_cong,
                ["chu_dau_tu"] = data.chu_dau_tu,
                ["thoi_gian"] = data.thoi_gian
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
            else deleteFile(fileOld);
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

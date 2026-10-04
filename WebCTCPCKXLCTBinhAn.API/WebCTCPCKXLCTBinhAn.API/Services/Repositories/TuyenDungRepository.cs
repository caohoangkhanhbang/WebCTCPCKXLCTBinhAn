using Npgsql;
using System.Data;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class TuyenDungRepository(NpgsqlDataSource dataSource, IManipulationDB manipulationDB, IFileService fileService) : ITuyenDungRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly IFileService _fileService = fileService;
        private readonly string tenBang = "tuyen_dung";
        private readonly string tenCot = "hinh";
        private readonly string dsCot = " id, ten_cong_viec, mo_ta, noi_dung, hinh, dia_diem, ngay_bd_tuyen, ngay_kt_tuyen, luong, hien_thi ";

        public async Task<PaginationResponse<TuyenDung>> GetPagedAsync(int page, int pageSize, string? search = "")
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
                      ten_cong_viec ILIKE @search  
                      OR mo_ta ILIKE @search
                      OR noi_dung ILIKE @search
                      OR dia_diem ILIKE @search
                      OR luong ILIKE @search
                      OR ngay_bd_tuyen::text ILIKE @search
                      OR ngay_kt_tuyen::text ILIKE @search
                ";
            }

            var result = new PaginationResponse<TuyenDung>
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
                result.Items.Add(new TuyenDung
                {
                    id = dataReader.GetInt32(0),
                    ten_cong_viec = dataReader["ten_cong_viec"] != DBNull.Value ? dataReader.GetString(1) : null,
                    mo_ta = dataReader["mo_ta"] != DBNull.Value ? dataReader.GetString(2) : null,
                    noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(3) : null,
                    hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(4) : null,
                    dia_diem = dataReader["dia_diem"] != DBNull.Value ? dataReader.GetString(5) : null,
                    ngay_bd_tuyen = dataReader["ngay_bd_tuyen"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(6)) : (DateOnly?)null,
                    ngay_kt_tuyen = dataReader["ngay_kt_tuyen"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(7)) : (DateOnly?)null,
                    luong = dataReader["luong"] != DBNull.Value ? dataReader.GetString(8) : null,
                    hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(9) : (bool?)null
                });
            }
            result.TotalPages = (int)Math.Ceiling((double)result.TotalItems / pageSize);
            return result;
        }

        public async Task<TuyenDung?> GetById(int id)
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

            return new TuyenDung
            {
                id = dataReader.GetInt32(0),
                ten_cong_viec = dataReader["ten_cong_viec"] != DBNull.Value ? dataReader.GetString(1) : null,
                mo_ta = dataReader["mo_ta"] != DBNull.Value ? dataReader.GetString(2) : null,
                noi_dung = dataReader["noi_dung"] != DBNull.Value ? dataReader.GetString(3) : null,
                hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(4) : null,
                dia_diem = dataReader["dia_diem"] != DBNull.Value ? dataReader.GetString(5) : null,
                ngay_bd_tuyen = dataReader["ngay_bd_tuyen"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(6)) : (DateOnly?)null,
                ngay_kt_tuyen = dataReader["ngay_kt_tuyen"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(7)) : (DateOnly?)null,
                luong = dataReader["luong"] != DBNull.Value ? dataReader.GetString(8) : null,
                hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(9) : (bool?)null
            };
        }

        public async Task<bool> Insert(TuyenDung data)
        {
            if (data.file != null && data.file.Length > 0)
            {
                data.hinh = await _fileService.SaveFileAsync(data.file, $"DuAn/{DateTime.Now:yyyy/MM/dd}");
            }

            var dataToInsert = new Dictionary<string, object?>
            {
                ["ten_cong_viec"] = data.ten_cong_viec,
                ["mo_ta"] = data.mo_ta,
                ["noi_dung"] = data.noi_dung,
                ["hinh"] = data.hinh,
                ["dia_diem"] = data.dia_diem,
                ["ngay_bd_tuyen"] = data.ngay_bd_tuyen,
                ["ngay_kt_tuyen"] = data.ngay_kt_tuyen,
                ["luong"] = data.luong,
                ["hien_thi"] = data.hien_thi,
                ["created_date"] = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            return await _manipulationDB.InsertDynamicAsync(
                tenBang,
                dataToInsert
            );
        }

        public async Task<bool> Update(int id, TuyenDung data)
        {
            string fileOld = _fileService.GetFileName(tenBang, tenCot, id);
            string fileNew = "";
            if (data.file != null && data.file.Length > 0)
            {
                fileNew = data.hinh = await _fileService.SaveFileAsync(data.file, $"DuAn/{DateTime.Now:yyyy/MM/dd}");
            }
            var dataToUpdate = new Dictionary<string, object?>
            {
                ["ten_cong_viec"] = data.ten_cong_viec,
                ["mo_ta"] = data.mo_ta,
                ["noi_dung"] = data.noi_dung,
                ["dia_diem"] = data.dia_diem,
                ["ngay_bd_tuyen"] = data.ngay_bd_tuyen,
                ["ngay_kt_tuyen"] = data.ngay_kt_tuyen,
                ["luong"] = data.luong,
                ["hien_thi"] = data.hien_thi,
                ["created_date"] = DateOnly.FromDateTime(DateTime.UtcNow)
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


using Npgsql;
using System.Data;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class ThongTinCongTyReponsitory(NpgsqlDataSource dataSource, IManipulationDB manipulationDB, IFileService fileService) : IThongTinCongTyReponsitory
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        private readonly IManipulationDB _manipulationDB = manipulationDB;
        private readonly IFileService _fileService = fileService;
        private readonly string tenBang = "thong_tin_cty";
        private readonly string tenCot = "hinh";
        private readonly string dsCot = " id, ten_cty, logo, dia_chi, email, sdt, ma_so_thue, hien_thi, hinh, slogan, linh_vuc, nam_thanh_lap ";

        public async Task<ThongTinCongTy?> GetInfo()
        {
            string sql = $@"
                                SELECT {dsCot}
                                FROM {tenBang}
                                order by id asc 
                                LIMIT 1;
                                ";

            await using var cmd = _dataSource.CreateCommand(sql);
            await using var dataReader = await cmd.ExecuteReaderAsync(
                CommandBehavior.SingleRow
            );

            if (!await dataReader.ReadAsync())
                return null;

            return new ThongTinCongTy
            {
                id = dataReader.GetInt32(0),
                ten_cty = dataReader["ten_cty"] != DBNull.Value ? dataReader.GetString(1) : null,
                logo = dataReader["logo"] != DBNull.Value ? dataReader.GetString(2) : null,
                dia_chi = dataReader["dia_chi"] != DBNull.Value ? dataReader.GetString(3) : null,
                email = dataReader["email"] != DBNull.Value ? dataReader.GetString(4) : null,
                sdt = dataReader["sdt"] != DBNull.Value ? dataReader.GetString(5) : null,
                ma_so_thue = dataReader["ma_so_thue"] != DBNull.Value ? dataReader.GetString(6) : null,
                hien_thi = dataReader["hien_thi"] != DBNull.Value ? dataReader.GetBoolean(7) : (bool?)null,
                hinh = dataReader["hinh"] != DBNull.Value ? dataReader.GetString(8) : null,
                slogan = dataReader["slogan"] != DBNull.Value ? dataReader.GetString(9) : null,
                linh_vuc = dataReader["linh_vuc"] != DBNull.Value ? dataReader.GetString(10) : null,
                nam_thanh_lap = dataReader["nam_thanh_lap"] != DBNull.Value ? DateOnly.FromDateTime(dataReader.GetDateTime(11)) : null
            };
        }

        public async Task<bool> Insert(ThongTinCongTy data, IFormFile? logoFile, IFormFile? hinhFile)
        {
            if (logoFile != null && logoFile.Length > 0)
            {
                data.logo = await _fileService.SaveFileAsync(logoFile, $"ThongTinCongTy/{DateTime.Now:yyyy/MM/dd}");
            }
            if (hinhFile != null && hinhFile.Length > 0)
            {
                data.hinh = await _fileService.SaveFileAsync(hinhFile, $"ThongTinCongTy/{DateTime.Now:yyyy/MM/dd}");
            }

            var dataToInsert = new Dictionary<string, object?>
            {
                ["ten_cty"] = data.ten_cty,
                ["logo"] = data.logo,
                ["dia_chi"] = data.dia_chi,
                ["email"] = data.email,
                ["sdt"] = data.sdt,
                ["ma_so_thue"] = data.ma_so_thue,
                ["hien_thi"] = data.hien_thi,
                ["hinh"] = data.hinh,
                ["slogan"] = data.slogan,
                ["linh_vuc"] = data.linh_vuc,
                ["nam_thanh_lap"] = data.nam_thanh_lap
            };
            return await _manipulationDB.InsertDynamicAsync(
                tenBang,
                dataToInsert
            );
        }

        public async Task<bool> Update(int id, ThongTinCongTy data, IFormFile? logoFile, IFormFile? hinhFile)
        {
            string fileLogoOld = _fileService.GetFileName(tenBang, "logo", id);
            string fileHinhOld = _fileService.GetFileName(tenBang, "hinh", id);
            string fileLogoNew = "";
            string fileHinhNew = "";
            if (logoFile != null && logoFile.Length > 0)
            {
                fileLogoNew = data.logo = await _fileService.SaveFileAsync(logoFile, $"ThongTinCongTy/{DateTime.Now:yyyy/MM/dd}");
            }
            if (hinhFile != null && hinhFile.Length > 0)
            {
                fileHinhNew = data.hinh = await _fileService.SaveFileAsync(hinhFile, $"ThongTinCongTy/{DateTime.Now:yyyy/MM/dd}");
            }
            var dataToUpdate = new Dictionary<string, object?>
            {
                ["ten_cty"] = data.ten_cty,
                ["dia_chi"] = data.dia_chi,
                ["email"] = data.email,
                ["sdt"] = data.sdt,
                ["ma_so_thue"] = data.ma_so_thue,
                ["hien_thi"] = data.hien_thi,
                ["slogan"] = data.slogan,
                ["linh_vuc"] = data.linh_vuc,
                ["nam_thanh_lap"] = data.nam_thanh_lap
            };
            if (!string.IsNullOrWhiteSpace(fileHinhNew))
                dataToUpdate.Add("hinh", fileHinhNew);
            if (!string.IsNullOrWhiteSpace(fileLogoNew))
                dataToUpdate.Add("logo", fileLogoNew);
            var whereConditions = new Dictionary<string, object?>
            {
                ["id"] = id
            };
            var result = await _manipulationDB.UpdateDynamicAsync(
                tenBang,
                dataToUpdate,
                whereConditions
            );
            if (!result)
            {
                if (!string.IsNullOrWhiteSpace(fileLogoNew))
                    deleteFile(fileLogoNew);
                if (!string.IsNullOrWhiteSpace(fileHinhNew))
                    deleteFile(fileHinhNew);
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(fileLogoNew))
                    deleteFile(fileLogoOld);
                if (!string.IsNullOrWhiteSpace(fileHinhNew))
                    deleteFile(fileHinhOld);
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
    }
}


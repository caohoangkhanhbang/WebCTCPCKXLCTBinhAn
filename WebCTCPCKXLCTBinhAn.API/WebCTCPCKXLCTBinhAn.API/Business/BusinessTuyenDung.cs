using Npgsql;
using System.Data;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Business
{
    public class BusinessTuyenDung(IConnectionService connectionService, IFileService fileService)
    {
        private readonly IConnectionService _connectionService = connectionService;
        private readonly IFileService _fileService = fileService;

        public async Task<bool> SubmitUngTuyen(UngTuyenDTO data)
        {
            if (data == null) return false;
            var fileName = await _fileService.SaveFileAsync(data.file, $"CV/{DateTime.Now:yyyy/MM/dd}");
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            string sql = "INSERT INTO ung_tuyen (id_tuyen_dung, ten, email, sdt, filecv, created_date) VALUES (@id_tuyen_dung, @ten, @email, @sdt, @filecv, @created_date)";
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            cmd.Parameters.AddWithValue("@id_tuyen_dung", data.id_tuyen_dung);
            cmd.Parameters.AddWithValue("@ten", data.ten);
            cmd.Parameters.AddWithValue("@email", data.email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@sdt", data.sdt ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@filecv", fileName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@created_date", DateOnly.FromDateTime(DateTime.UtcNow));
            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            if (rowsAffected == 0) return false;
            return true;
        }

        public async Task<List<TuyenDung>> GetTuyenDung()
        {
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            string sql = @"
                            SELECT id, ten_cong_viec, mo_ta, noi_dung, hinh, dia_diem, ngay_bd_tuyen, ngay_kt_tuyen, luong
                            FROM public.tuyen_dung
                            WHERE hien_thi = true 
                                  AND (ngay_kt_tuyen >= CURRENT_DATE OR ngay_kt_tuyen IS NULL)
                            ORDER BY ngay_kt_tuyen ASC;
                            ";
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            var reader = await cmd.ExecuteReaderAsync();
            var tuyenDungList = new List<TuyenDung>();
            while (await reader.ReadAsync())
            {
                tuyenDungList.Add(new TuyenDung
                {
                    id = reader.GetInt32("id"),
                    ten_cong_viec = reader.GetString("ten_cong_viec"),
                    mo_ta = reader.IsDBNull("mo_ta") ? null : reader.GetString("mo_ta"),
                    noi_dung = reader.IsDBNull("noi_dung") ? null : reader.GetString("noi_dung"),
                    hinh = reader.IsDBNull("hinh") ? null : reader.GetString("hinh"),
                    dia_diem = reader.IsDBNull("dia_diem") ? null : reader.GetString("dia_diem"),
                    ngay_bd_tuyen = reader.IsDBNull("ngay_bd_tuyen") ? null : DateOnly.FromDateTime(reader.GetDateTime("ngay_bd_tuyen")),
                    ngay_kt_tuyen = reader.IsDBNull("ngay_kt_tuyen") ? null : DateOnly.FromDateTime(reader.GetDateTime("ngay_kt_tuyen")),
                    luong = reader.IsDBNull("luong") ? null : reader.GetString("luong")
                });
            }
            return tuyenDungList;
        }

    }
}

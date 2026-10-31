using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class DashboardRespository(NpgsqlDataSource dataSource) : IDashboardRespository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        public async Task<int> TongSoDuAn()
        {
            string sql = "select count(*) from du_an";
            await using var cmd = _dataSource.CreateCommand(sql);
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result ?? 0);
        }

        public async Task<int> SoLinhVucHoatDong()
        {
            string sql = "select count(*) from giai_phap";
            await using var cmd = _dataSource.CreateCommand(sql);
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result ?? 0);
        }

        public async Task<int> SoNguoiLienHeTrongThang()
        {
            string sql = @"
            SELECT COUNT(*) 
            FROM lien_he 
            WHERE created_date >= date_trunc('month', NOW())::date 
              AND created_date < (date_trunc('month', NOW()) + INTERVAL '1 month')::date;
            ";
            await using var cmd = _dataSource.CreateCommand(sql);
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result ?? 0);
        }

        public async Task<int> SoUngVienViecLamTrongThang()
        {
            string sql = @"
            SELECT COUNT(*) 
            FROM ung_tuyen 
            WHERE created_date >= date_trunc('month', NOW())::date 
              AND created_date < (date_trunc('month', NOW()) + INTERVAL '1 month')::date;
            ";
            await using var cmd = _dataSource.CreateCommand(sql);
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result ?? 0);
        }

        public async Task<List<LienHe>> ListNguoiLienHeTrongThang()
        {
            string sql = @"
            SELECT ten, noi_dung, created_date 
            FROM lien_he 
            WHERE created_date >= date_trunc('month', NOW())::date 
              AND created_date < (date_trunc('month', NOW()) + INTERVAL '1 month')::date;
            ";
            await using var cmd = _dataSource.CreateCommand(sql);
            await using var reader = await cmd.ExecuteReaderAsync();
            List<LienHe> lst = new List<LienHe>();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    LienHe data = new LienHe()
                    {
                        ten = !await reader.IsDBNullAsync(0) ? reader.GetString(0) : "",
                        noi_dung = !await reader.IsDBNullAsync(1) ? reader.GetString(1) : "",
                        created_date = !await reader.IsDBNullAsync(2) ? reader.GetDateTime(2) : null
                    };
                    lst.Add(data);
                }
            }
            return lst;
        }

        public async Task<List<UngTuyen>> ListUngVienViecLamTrongThang()
        {
            string sql = @"
            SELECT ten, ten_cong_viec, lh.created_date 
            FROM ung_tuyen lh left join tuyen_dung td on lh.id_tuyen_dung = td.id
            WHERE lh.created_date >= date_trunc('month', NOW())::date 
              AND lh.created_date < (date_trunc('month', NOW()) + INTERVAL '1 month')::date;
            ";
            await using var cmd = _dataSource.CreateCommand(sql);
            await using var reader = await cmd.ExecuteReaderAsync();
            List<UngTuyen> lst = new List<UngTuyen>();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    UngTuyen data = new UngTuyen()
                    {
                        ten = !await reader.IsDBNullAsync(0) ? reader.GetString(0) : "",
                        ten_cong_viec = !await reader.IsDBNullAsync(1) ? reader.GetString(1) : "",
                        created_date = !await reader.IsDBNullAsync(2) ? reader.GetFieldValue<DateOnly>(2) : null
                    };
                    lst.Add(data);
                }
            }
            return lst;
        }
    }
}

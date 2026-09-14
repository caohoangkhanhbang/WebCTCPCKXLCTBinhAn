using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Business
{
    public class BussinessLienHe(IConnectionService connectionService)
    {
        private readonly IConnectionService _connectionService = connectionService;
        public async Task<bool> SubmitLienHe(LienHe data)
        {
            if (data == null) return false;
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            string sql = "INSERT INTO lien_he (ten, cccd, email, sdt, noi_dung, created_date) VALUES (@ten, @cccd, @email, @sdt, @noi_dung, @created_date)";
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            cmd.Parameters.AddWithValue("@ten", data.ten);
            cmd.Parameters.AddWithValue("@cccd", data.cccd ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@email", data.email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@sdt", data.sdt ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@noi_dung", data.noi_dung);
            cmd.Parameters.AddWithValue("@created_date", DateOnly.FromDateTime(DateTime.UtcNow));

            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            if(rowsAffected == 0) return false;
            return true;
        }
    }
}

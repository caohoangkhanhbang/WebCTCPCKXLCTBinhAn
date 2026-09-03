using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Business
{
    public class BusinessGioiThieu(IConnectionService connectionService)
    {
        private readonly IConnectionService _connectionService = connectionService;

        public async Task<List<CacCotMoc>> getGioiThieu()
        {
            List<CacCotMoc> lst = new List<CacCotMoc>();
            string sql = "SELECT id, thoi_gian, noi_dung FROM cac_cot_moc where hien_thi = true order by id asc";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    lst.Add(new CacCotMoc
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        thoi_gian = reader["thoi_gian"] != DBNull.Value ? reader["thoi_gian"].ToString() : string.Empty,
                        noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty
                    });
                }
            }
            return lst;
        }
    }
}

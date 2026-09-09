using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Business
{
    public class BusinessLinhVucHoatDong(IConnectionService connectionService)
    {
        private readonly IConnectionService _connectionService = connectionService;
        public async Task<List<GiaiPhap>> GetLinhVucHoatDong()
        {
            //await using var connection = NpgsqlConnection(_connectionService.GetConnectionString());
            //string sql = "";
            //await using var command = NpgsqlCommand(sql, connection);

            return new List<GiaiPhap>();
        }
    }
}

using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Services.Repositories
{
    public class SelectOptionRepository(NpgsqlDataSource npgsqlDataSource) : ISelectOptionRepository
    {
        private readonly NpgsqlDataSource _npgsqlDataSource = npgsqlDataSource;
        public async Task<List<LoaiTrang>> GetLoaiTrang()
        {
            List<LoaiTrang> lst = new List<LoaiTrang>();
            string sql = @"
                            SELECT id, ten_trang FROM loai_trang
                            ORDER BY ten_trang ASC LIMIT 100
                            ";
            await using var cmd = _npgsqlDataSource.CreateCommand(sql);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    LoaiTrang data = new LoaiTrang();
                    data.id = reader["id"] != DBNull.Value ? reader.GetInt32(0) : null;
                    data.ten_trang = reader["ten_trang"] != DBNull.Value ? reader["ten_trang"].ToString() : null;
                    lst.Add(data);
                }
            }
            return lst;
        }
    }
}

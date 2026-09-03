namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly IConfiguration _configuration;
        public ConnectionService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }
        public string GetConnectionString()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("Chuỗi kết nối rỗng!");
            }
            return connectionString;
        }
    }
}

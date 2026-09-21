using WebCTCPCKXLCTBinhAn.API.Models;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public interface IJwtService
    {
        JwtResult GenerateToken(User user);
    }

    public record JwtResult(string AccessToken, DateTime ExpiresAt);
}

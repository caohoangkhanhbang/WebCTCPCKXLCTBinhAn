using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebCTCPCKXLCTBinhAn.API.Models;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public class JwtService(IConfiguration configuration):IJwtService
    {
        private readonly IConfiguration _configuration = configuration;
        public JwtResult GenerateToken(User user) 
        { 
            var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key chưa được cấu hình");
            var issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer chưa được cấu hình");
            var audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience chưa được cấu hình");
            var experationMinutes = _configuration.GetValue<int>("Jwt:ExpirationMinutes");
            var expiresAt = DateTime.UtcNow.AddMinutes(experationMinutes);
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.FullName),
                new(ClaimTypes.Role, user.Role),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var jwt = new JwtSecurityToken(
               issuer: issuer,
               audience: audience,
               claims: claims,
               expires: expiresAt,
               signingCredentials: credentials
           );


            var token = new JwtSecurityTokenHandler()
                    .WriteToken(jwt);

            return new JwtResult(token, expiresAt);
        }

    }
}

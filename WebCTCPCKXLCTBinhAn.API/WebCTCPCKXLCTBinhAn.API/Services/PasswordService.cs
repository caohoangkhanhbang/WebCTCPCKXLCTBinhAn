using Microsoft.AspNetCore.Identity;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public class PasswordService:IPasswordService
    {
        private readonly PasswordHasher<object> _passwordHasher = new();

        public string HashPassword(string password)
        {
            return _passwordHasher.HashPassword(null!, password);
        }

        public bool VerifyPassword(string hash, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(null!, hash, password);
            return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
        }

    }
}

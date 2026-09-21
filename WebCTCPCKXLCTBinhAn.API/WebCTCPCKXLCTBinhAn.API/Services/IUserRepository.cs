using WebCTCPCKXLCTBinhAn.API.Models;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(Guid id);
        Task<bool> EmailExistsAsync(string email);
        Task<User> CreateAsync(User user);
    }
}

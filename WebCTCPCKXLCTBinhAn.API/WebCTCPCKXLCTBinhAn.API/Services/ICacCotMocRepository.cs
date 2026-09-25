using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public interface ICacCotMocRepository
    {
        Task<PaginationResponse<CacCotMoc>> GetPagedAsync(int page, int pageSize, string? search = "");
        Task<CacCotMoc?> GetById(int id);
        Task<bool> Insert(CacCotMoc data);
        Task<bool> Update(int id, CacCotMoc data);
        Task<bool> Delete(int id);
    }
}

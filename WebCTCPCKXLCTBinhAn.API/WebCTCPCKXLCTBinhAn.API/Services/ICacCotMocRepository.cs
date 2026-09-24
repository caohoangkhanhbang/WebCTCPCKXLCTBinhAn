using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.classes;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public interface ICacCotMocRepository
    {
        Task<PaginationResponse<CacCotMoc>> GetPagedAsync(int page, int pageSize, string? search = "");
    }
}

using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface ISlideHomeRepository
    {
        Task<PaginationResponse<SlideHome>> GetPagedAsync(int page, int pageSize, string? search = "");
        Task<SlideHome?> GetById(int id);
        Task<bool> Insert(SlideHome data, IFormFile? file);
        Task<bool> Update(int id, SlideHome data, IFormFile? file);
        Task<bool> Delete(int id);
    }
}

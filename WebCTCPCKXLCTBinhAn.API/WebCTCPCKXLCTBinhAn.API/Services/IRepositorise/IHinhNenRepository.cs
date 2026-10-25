using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface IHinhNenRepository
    {
        Task<PaginationResponse<HinhNen>> GetPagedAsync(int page, int pageSize, string? search = "");
        Task<HinhNen?> GetById(int id);
        Task<bool> Insert(HinhNen data, List<IFormFile>? files);
        Task<bool> Update(int id, HinhNen data, IFormFile? files);
        Task<bool> Delete(int id);
    }
}

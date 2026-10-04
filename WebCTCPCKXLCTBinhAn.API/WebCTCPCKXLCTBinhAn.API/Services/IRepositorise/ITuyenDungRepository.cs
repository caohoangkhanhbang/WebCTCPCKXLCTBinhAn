using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface ITuyenDungRepository
    {
        Task<PaginationResponse<TuyenDung>> GetPagedAsync(int page, int pageSize, string? search = "");
        Task<TuyenDung?> GetById(int id);
        Task<bool> Insert(TuyenDung data);
        Task<bool> Update(int id, TuyenDung data);
        Task<bool> Delete(int id);
    }
}

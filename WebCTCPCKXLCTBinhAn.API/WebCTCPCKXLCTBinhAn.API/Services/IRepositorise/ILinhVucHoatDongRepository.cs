using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface ILinhVucHoatDongRepository
    {
        Task<PaginationResponse<GiaiPhap>> GetPagedAsync(int page, int pageSize, string? search = "");
        Task<GiaiPhap?> GetById(int id);
        Task<bool> Insert(GiaiPhap data);
        Task<bool> Update(int id, GiaiPhap data);
        Task<bool> Delete(int id);
    }
}

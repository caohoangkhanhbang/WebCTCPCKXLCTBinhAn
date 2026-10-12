using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface ILienHeRepository
    {
        Task<PaginationResponse<LienHe>> GetList(int page, int pageSize, string? search = "");
        Task<bool> Update(int id, LienHe data);
        Task<bool> Delete(int id);
    }
}

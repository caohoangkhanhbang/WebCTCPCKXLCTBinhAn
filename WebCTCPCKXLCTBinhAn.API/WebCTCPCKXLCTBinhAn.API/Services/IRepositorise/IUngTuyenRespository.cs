using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface IUngTuyenRespository
    {
        Task<PaginationResponse<UngTuyen>> GetList(int page, int pageSize, string? search = "");
        Task<bool> Update(int id, UngTuyen data);
        Task<bool> Delete(int id);
    }
}

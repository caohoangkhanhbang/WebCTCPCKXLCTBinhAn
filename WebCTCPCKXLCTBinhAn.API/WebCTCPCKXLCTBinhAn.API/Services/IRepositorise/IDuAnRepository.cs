using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface IDuAnRepository
    {
        Task<PaginationResponse<DuAn>> GetPagedAsync(int page, int pageSize, string? search = "");
        Task<DuAn?> GetById(int id);
        Task<bool> Insert(DuAn data);
        Task<bool> Update(int id, DuAn data);
        Task<bool> Delete(int id);
    }
}

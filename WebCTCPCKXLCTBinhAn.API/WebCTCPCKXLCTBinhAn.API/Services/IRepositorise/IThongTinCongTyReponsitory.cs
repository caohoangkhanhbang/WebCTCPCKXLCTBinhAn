using WebCTCPCKXLCTBinhAn.API.classes;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface IThongTinCongTyReponsitory
    {
        Task<ThongTinCongTy?> GetInfo();
        Task<bool> Insert(ThongTinCongTy data, IFormFile? logoFile, IFormFile? hinhFile);
        Task<bool> Update(int id, ThongTinCongTy data, IFormFile? logoFile, IFormFile? hinhFile);
        Task<bool> Delete(int id);
    }
}

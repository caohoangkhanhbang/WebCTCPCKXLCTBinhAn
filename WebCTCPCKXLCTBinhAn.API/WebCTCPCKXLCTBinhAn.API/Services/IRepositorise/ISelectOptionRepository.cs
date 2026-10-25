using WebCTCPCKXLCTBinhAn.API.classes;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface ISelectOptionRepository
    {
        Task<List<LoaiTrang>> GetLoaiTrang();
    }
}

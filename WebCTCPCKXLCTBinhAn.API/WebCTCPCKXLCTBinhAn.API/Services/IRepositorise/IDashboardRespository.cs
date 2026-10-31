using WebCTCPCKXLCTBinhAn.API.classes;

namespace WebCTCPCKXLCTBinhAn.API.Services.IRepositorise
{
    public interface IDashboardRespository
    {
        Task<int> TongSoDuAn();
        Task<int> SoLinhVucHoatDong();
        Task<int> SoNguoiLienHeTrongThang();
        Task<int> SoUngVienViecLamTrongThang();
        Task<List<LienHe>> ListNguoiLienHeTrongThang();
        Task<List<UngTuyen>> ListUngVienViecLamTrongThang();

    }
}
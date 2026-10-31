using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController(IDashboardRespository dashboardRespository) : Controller
    {
        private readonly IDashboardRespository _dashboardRespository = dashboardRespository;

        [HttpGet("tong-so-du-an")]
        public async Task<IActionResult> TongSoDuAn()
        {
            return Ok(await _dashboardRespository.TongSoDuAn());
        }

        [HttpGet("so-linh-vuc-hoat-dong")]
        public async Task<IActionResult> SoLinhVucHoatDong()
        {
            return Ok(await _dashboardRespository.SoLinhVucHoatDong());
        }

        [HttpGet("so-nguoi-lien-he-trong-thang")]
        public async Task<IActionResult> SoNguoiLienHeTrongThang()
        {
            return Ok(await _dashboardRespository.SoNguoiLienHeTrongThang());
        }

        [HttpGet("so-ung-vien-viec-lam-trong-thang")]
        public async Task<IActionResult> SoUngVienViecLamTrongThang()
        {
            return Ok(await _dashboardRespository.SoUngVienViecLamTrongThang());
        }

        [HttpGet("list-nguoi-lien-he-trong-thang")]
        public async Task<IActionResult> ListNguoiLienHeTrongThang()
        {
            return Ok(await _dashboardRespository.ListNguoiLienHeTrongThang());
        }

        [HttpGet("list-ung-vien-viec-lam-trong-thang")]
        public async Task<IActionResult> ListUngVienViecLamTrongThang()
        {
            return Ok(await _dashboardRespository.ListUngVienViecLamTrongThang());
        }

    }
}

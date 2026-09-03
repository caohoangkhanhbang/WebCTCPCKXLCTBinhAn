using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController(BusinessHome businessHome) : Controller
    {
        private readonly BusinessHome _businessHome = businessHome;

        [HttpGet("slide-home")]
        public async Task<IActionResult> GetSlideHome()
        {
            var data = await _businessHome.GetSlideHome();
            return Ok(data);
        }

        [HttpGet("du-an")]
        public async Task<IActionResult> GetDuAn()
        {
            var data = await _businessHome.GetDuAn();
            return Ok(data);
        }

        [HttpGet("du-an-tieu-bieu")]
        public async Task<IActionResult> GetDuAnTieuBieu()
        {
            var data = await _businessHome.GetDuAnTieuBieu();
            return Ok(data);
        }

        [HttpGet("loai-du-an")]
        public async Task<IActionResult> getLoaiDuAn()
        {
            var data = await _businessHome.getLoaiDuAn();
            return Ok(data);
        }

        [HttpGet("cac-cot-moc")]
        public async Task<IActionResult> GetCacCotMoc()
        {
            var data = await _businessHome.GetCacCotMoc();
            return Ok(data);
        }

        [HttpGet("giai-phap")]
        public async Task<IActionResult> GetGiaiPhap()
        {
            var data = await _businessHome.GetGiaiPhap();
            return Ok(data);
        }

        [HttpGet("gioi-thieu")]
        public async Task<IActionResult> GetGioiThieu()
        {
            var data = await _businessHome.GetGioiThieu();
            return Ok(data);
        }

        [HttpGet("tuyen-dung")]
        public async Task<IActionResult> GetTuyenDung()
        {
            var data = await _businessHome.GetTuyenDung();
            return Ok(data);
        }

        [HttpGet("thong-tin-cong-ty")]
        [OutputCache(Duration = 3600)] // Cache kết quả ở C# trong 1 giờ. Tác dụng: Dù có 1.000 người mới mở web cùng lúc, Server chỉ query Database đúng 1 lần duy nhất trong vòng 1 giờ, 999 người còn lại lấy kết quả trực tiếp từ RAM đệm của .NET.
        public async Task<IActionResult> GetThongTinCongTy()
        {
            var data = await _businessHome.getThongTinCongTy();
            return Ok(data);
        }


    }
}

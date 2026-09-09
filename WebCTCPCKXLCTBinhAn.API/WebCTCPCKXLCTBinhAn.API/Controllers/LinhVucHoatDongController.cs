using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    public class LinhVucHoatDongController(BusinessLinhVucHoatDong businessLinhVucHoatDong) : Controller
    {
        private readonly BusinessLinhVucHoatDong _businessLinhVucHoatDong = businessLinhVucHoatDong;

        public async Task<IActionResult> GetLinhVucHoatDong()
        {
            var linhVucHoatDong = await _businessLinhVucHoatDong.GetLinhVucHoatDong();
            return Ok(linhVucHoatDong);
        }
    }
}

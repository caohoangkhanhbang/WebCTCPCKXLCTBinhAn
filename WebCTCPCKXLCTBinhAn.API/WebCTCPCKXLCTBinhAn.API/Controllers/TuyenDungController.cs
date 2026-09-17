using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.DTOs;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TuyenDungController(BusinessTuyenDung businessTuyenDung) : Controller
    {
        private readonly BusinessTuyenDung _businessTuyenDung = businessTuyenDung;
        [HttpPost("post-ung-tuyen")]
        public async Task<IActionResult> SubmitTuyenDung([FromForm] UngTuyenDTO data)
        {
            var result = await _businessTuyenDung.SubmitUngTuyen(data);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetTuyenDung()
        {
            var result = await _businessTuyenDung.GetTuyenDung();
            return Ok(result);
        }
    }
}

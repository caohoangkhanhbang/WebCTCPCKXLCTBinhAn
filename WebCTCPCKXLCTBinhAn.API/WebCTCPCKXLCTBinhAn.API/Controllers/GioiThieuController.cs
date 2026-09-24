using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GioiThieuController(BusinessGioiThieu businessGioiThieu, ICacCotMocRepository cacCotMocRepository) : Controller
    {
        private readonly BusinessGioiThieu _businessGioiThieu = businessGioiThieu;
        private readonly ICacCotMocRepository _cacCotMocRepository = cacCotMocRepository;

        [HttpGet("cac-cot-moc")]
        public async Task<IActionResult> getGioiThieu()
        {
            var data = await _businessGioiThieu.getGioiThieu();
            return Ok(data);
        }

        [HttpGet("list")]
        public async Task<IActionResult> getPhan([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? search = "")
        {
            var data = await _cacCotMocRepository.GetPagedAsync(page, pageSize, search);
            return Ok(data);
        }


    }
}

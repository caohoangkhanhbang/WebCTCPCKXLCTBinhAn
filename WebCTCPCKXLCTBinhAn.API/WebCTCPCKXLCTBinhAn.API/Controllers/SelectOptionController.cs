using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SelectOptionController(ISelectOptionRepository selectOptionRepository) : Controller
    {
        private readonly ISelectOptionRepository _selectOptionRepository = selectOptionRepository;
        [HttpGet("loai-trang")]
        public async Task<IActionResult> ListLoaiTrang()
        {
            var data = await _selectOptionRepository.GetLoaiTrang();
            return Ok(data);
        }
    }
}

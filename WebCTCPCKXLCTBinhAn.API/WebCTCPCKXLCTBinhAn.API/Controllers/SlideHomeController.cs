using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlideHomeController(ISlideHomeRepository slideHomeRepository) : Controller
    {
        private readonly ISlideHomeRepository _slideHomeRepository = slideHomeRepository;

        [HttpGet]
        public async Task<IActionResult> getPhan([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? search = "")
        {
            var data = await _slideHomeRepository.GetPagedAsync(page, pageSize, search);
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getCacCotMocById(int id)
        {
            var data = await _slideHomeRepository.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> insertCacCotMoc([FromForm] SlideHome data, IFormFile? file)
        {
            var result = await _slideHomeRepository.Insert(data, file);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> updateCacCotMoc(int id, [FromForm] SlideHome data, IFormFile? file)
        {
            var result = await _slideHomeRepository.Update(id, data, file);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteCacCotMoc(int id)
        {
            var result = await _slideHomeRepository.Delete(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }
    }
}

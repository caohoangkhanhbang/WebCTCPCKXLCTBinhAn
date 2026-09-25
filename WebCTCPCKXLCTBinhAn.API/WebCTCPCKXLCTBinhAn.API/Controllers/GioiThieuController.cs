using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;
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

        [HttpGet("cac-cot-moc/{id}")]
        public async Task<IActionResult> getCacCotMocById(int id)
        {
            var data = await _cacCotMocRepository.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> insertCacCotMoc([FromBody] CacCotMoc data)
        {
            var result = await _cacCotMocRepository.Insert(data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> updateCacCotMoc(int id, [FromBody] CacCotMoc data)
        {
            var result = await _cacCotMocRepository.Update(id, data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteCacCotMoc(int id)
        {
            var result = await _cacCotMocRepository.Delete(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok();
        }

    }
}

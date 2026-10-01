using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LinhVucHoatDongController(BusinessLinhVucHoatDong businessLinhVucHoatDong, ILinhVucHoatDongRepository linhVucHoatDongRepository) : Controller
    {
        private readonly BusinessLinhVucHoatDong _businessLinhVucHoatDong = businessLinhVucHoatDong;
        private readonly ILinhVucHoatDongRepository _linhVucHoatDongRepository = linhVucHoatDongRepository;

        public async Task<IActionResult> GetLinhVucHoatDong()
        {
            var linhVucHoatDong = await _businessLinhVucHoatDong.GetLinhVucHoatDong();
            return Ok(linhVucHoatDong);
        }

        [HttpGet("list")]
        public async Task<IActionResult> getPhan([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? search = "")
        {
            var data = await _linhVucHoatDongRepository.GetPagedAsync(page, pageSize, search);
            return Ok(data);
        }

        [HttpGet("linh-vuc-hoat-dong/{id}")]
        public async Task<IActionResult> getCacCotMocById(int id)
        {
            var data = await _linhVucHoatDongRepository.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> insertCacCotMoc([FromForm] GiaiPhap data)
        {
            var result = await _linhVucHoatDongRepository.Insert(data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> updateCacCotMoc(int id, [FromBody] GiaiPhap data)
        {
            var result = await _linhVucHoatDongRepository.Update(id, data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteCacCotMoc(int id)
        {
            var result = await _linhVucHoatDongRepository.Delete(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }
    }
}

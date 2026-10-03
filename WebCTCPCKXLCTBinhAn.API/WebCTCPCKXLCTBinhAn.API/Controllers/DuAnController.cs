using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DuAnController(BusinessDuAn businessDuAn, IDuAnRepository duAnRepository) : ControllerBase
    {
        private readonly BusinessDuAn _businessDuAn = businessDuAn;
        private readonly IDuAnRepository _duAnRepository = duAnRepository;

        [HttpGet("get-du-an")]
        public async Task<IActionResult> GetDuAn([FromQuery] string? query, [FromQuery] int? lastId, [FromQuery] int pageSize = 10)
        {
            var data = await _businessDuAn.GetDuAn(query, lastId, pageSize);
            return Ok(data);
        }
        [HttpGet("get-du-an/{id}")]
        public async Task<IActionResult> GetDuAnChiTiet([FromRoute] int id)
        {
            var data = await _businessDuAn.GetDuAnChiTiet(id);
            return Ok(data);
        }

        [HttpGet("list")]
        public async Task<IActionResult> getPhan([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? search = "")
        {
            var data = await _duAnRepository.GetPagedAsync(page, pageSize, search);
            return Ok(data);
        }

        [HttpGet("du-an/{id}")]
        public async Task<IActionResult> getCacCotMocById(int id)
        {
            var data = await _duAnRepository.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> insertCacCotMoc([FromForm] DuAn data)
        {
            var result = await _duAnRepository.Insert(data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> updateCacCotMoc(int id, [FromForm] DuAn data)
        {
            var result = await _duAnRepository.Update(id, data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteCacCotMoc(int id)
        {
            var result = await _duAnRepository.Delete(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HinhNenController(IHinhNenRepository hinhNenRepository) : Controller
    {
        private readonly IHinhNenRepository _hinhNenRepository = hinhNenRepository;

        [HttpGet]
        public async Task<IActionResult> getList([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? search = "")
        {
            var data = await _hinhNenRepository.GetPagedAsync(page, pageSize, search);
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getById(int id)
        {
            var data = await _hinhNenRepository.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> insert([FromForm] HinhNen data, List<IFormFile>? file)
        {
            var result = await _hinhNenRepository.Insert(data, file);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(new { message = "Thêm mới thành công", data = result });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> update(int id, [FromForm] HinhNen data, IFormFile? file)
        {
            var result = await _hinhNenRepository.Update(id, data, file);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> delete(int id)
        {
            var result = await _hinhNenRepository.Delete(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }
    }
}

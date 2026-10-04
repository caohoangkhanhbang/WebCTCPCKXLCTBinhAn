using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.DTOs;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TuyenDungController(BusinessTuyenDung businessTuyenDung, ITuyenDungRepository tuyenDungRepository) : Controller
    {
        private readonly BusinessTuyenDung _businessTuyenDung = businessTuyenDung;
        private readonly ITuyenDungRepository _tuyenDungRepository = tuyenDungRepository;

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

        [HttpGet("list")]
        public async Task<IActionResult> getPhan([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string? search = "")
        {
            var data = await _tuyenDungRepository.GetPagedAsync(page, pageSize, search);
            return Ok(data);
        }

        [HttpGet("tuyen-dung/{id}")]
        public async Task<IActionResult> getCacCotMocById(int id)
        {
            var data = await _tuyenDungRepository.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> insertCacCotMoc([FromForm] TuyenDung data)
        {
            var result = await _tuyenDungRepository.Insert(data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> updateCacCotMoc(int id, [FromForm] TuyenDung data)
        {
            var result = await _tuyenDungRepository.Update(id, data);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteCacCotMoc(int id)
        {
            var result = await _tuyenDungRepository.Delete(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }
    }
}

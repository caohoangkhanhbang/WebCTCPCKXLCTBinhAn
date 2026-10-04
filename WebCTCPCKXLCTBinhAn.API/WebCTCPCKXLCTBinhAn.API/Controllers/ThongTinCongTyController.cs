using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThongTinCongTyController(IThongTinCongTyReponsitory thongTinCongTyReponsitory) : Controller
    {
        private readonly IThongTinCongTyReponsitory _thongTinCongTyReponsitory = thongTinCongTyReponsitory;
        [HttpGet("list")]
        public async Task<IActionResult> getIno()
        {
            var data = await _thongTinCongTyReponsitory.GetInfo();
            return Ok(data);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> insertCacCotMoc([FromForm] ThongTinCongTy data, IFormFile? logoFile, IFormFile? hinhFile)
        {
            var result = await _thongTinCongTyReponsitory.Insert(data, logoFile, hinhFile);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> updateCacCotMoc(int id, [FromForm] ThongTinCongTy data, IFormFile? logoFile, IFormFile? hinhFile)
        {
            var result = await _thongTinCongTyReponsitory.Update(id, data, logoFile, hinhFile);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteCacCotMoc(int id)
        {
            var result = await _thongTinCongTyReponsitory.Delete(id);
            if (!result)
            {
                return BadRequest();
            }
            return Ok(result);
        }
    }
}

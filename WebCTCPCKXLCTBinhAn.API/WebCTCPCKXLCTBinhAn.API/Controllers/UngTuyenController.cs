using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UngTuyenController(IUngTuyenRespository ungTuyenRespository) : Controller
    {
        private readonly IUngTuyenRespository _ungTuyenRespository = ungTuyenRespository;

        [HttpGet]
        public async Task<IActionResult> GetList(int page = 1, int pageSize = 10, string? search = "")
        {
            var result = await _ungTuyenRespository.GetList(page, pageSize, search);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UngTuyen data)
        {
            var result = await _ungTuyenRespository.Update(id, data);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _ungTuyenRespository.Delete(id);
            return Ok(result);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services.IRepositorise;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LienHeController(BussinessLienHe bussinessLienHe, ILienHeRepository lienHeRepository) : Controller
    {
        private readonly BussinessLienHe _bussinessLienHe = bussinessLienHe;
        private readonly ILienHeRepository _lienHeRepository = lienHeRepository;
        [HttpPost]
        public async Task<IActionResult> SubmitLienHe([FromBody] LienHe data)
        {
            var result = await _bussinessLienHe.SubmitLienHe(data);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetList(int page = 1, int pageSize = 10, string? search = "")
        {
            var result = await _lienHeRepository.GetList(page, pageSize, search);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LienHe data)
        {
            var result = await _lienHeRepository.Update(id, data);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _lienHeRepository.Delete(id);
            return Ok(result);
        }
    }
}

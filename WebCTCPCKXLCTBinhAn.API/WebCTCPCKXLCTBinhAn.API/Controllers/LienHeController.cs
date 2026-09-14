using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;
using WebCTCPCKXLCTBinhAn.API.classes;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LienHeController(BussinessLienHe bussinessLienHe) : Controller
    {
        private readonly BussinessLienHe _bussinessLienHe = bussinessLienHe;
        [HttpPost]
        public async Task<IActionResult> SubmitLienHe([FromBody] LienHe data)
        {
            var result = await _bussinessLienHe.SubmitLienHe(data);
            return Ok(result);
        }
    }
}

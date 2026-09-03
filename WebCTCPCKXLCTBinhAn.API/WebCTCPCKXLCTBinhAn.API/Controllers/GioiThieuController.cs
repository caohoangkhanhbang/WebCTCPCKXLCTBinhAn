using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GioiThieuController(BusinessGioiThieu businessGioiThieu) : Controller
    {
        private readonly BusinessGioiThieu _businessGioiThieu = businessGioiThieu;
        
        [HttpGet("cac-cot-moc")]
        public async Task<IActionResult> getGioiThieu()
        {
            var data = await _businessGioiThieu.getGioiThieu();
            return Ok(data);
        }
    }
}

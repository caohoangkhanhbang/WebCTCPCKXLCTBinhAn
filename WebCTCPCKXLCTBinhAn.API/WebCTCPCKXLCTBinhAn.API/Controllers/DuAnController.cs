using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Business;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DuAnController(BusinessDuAn businessDuAn) : ControllerBase
    {
        private readonly BusinessDuAn _businessDuAn = businessDuAn;
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
    }
}

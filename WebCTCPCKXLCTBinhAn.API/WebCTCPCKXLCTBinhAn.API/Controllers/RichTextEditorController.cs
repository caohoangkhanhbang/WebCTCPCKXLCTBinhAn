using Microsoft.AspNetCore.Mvc;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RichTextEditorController(IFileService fileService) : Controller
    {
        private readonly IFileService _fileService = fileService;
        [HttpPost("upload")]
        public async Task<IActionResult> Index(IFormFile file)
        {
            var urlImage = await _fileService.SaveFileAsync(file, $"richTexEditor/{DateTime.Now:yyyy/MM/dd}");
            var url = $"{Request.Scheme}://{Request.Host}/cdn/{urlImage}";
            return Ok(
                new
                {
                    url
                }
            );
        }
    }
}

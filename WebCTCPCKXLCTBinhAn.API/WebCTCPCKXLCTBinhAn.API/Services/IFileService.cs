namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string subFolder = "");
    }
}

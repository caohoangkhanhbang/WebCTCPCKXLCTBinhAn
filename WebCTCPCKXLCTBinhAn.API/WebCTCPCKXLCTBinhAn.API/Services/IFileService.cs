namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string subFolder = "");
        void DeleteFile(string filePath);
        string GetFileName(string tenBang, string tenCot, int id);
    }
}

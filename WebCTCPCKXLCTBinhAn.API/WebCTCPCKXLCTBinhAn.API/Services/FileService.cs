namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public class FileService : IFileService
    {
        private static readonly HashSet<string> BlockedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".exe", ".msi", ".bat", ".cmd", ".sh", ".php", ".asp", ".aspx",
            ".cshtml", ".jsp", ".dll", ".config", ".ps1", ".vbs", ".html", ".htm"
        };

        public async Task<string> SaveFileAsync(IFormFile file, string subFolder = "")
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(extension) || BlockedExtensions.Contains(extension))
                throw new InvalidOperationException("File không hợp lệ có thể chứa mã độc");
            if (await IsDangerousFileContentAsync(file))
                throw new InvalidOperationException("Phát hiện nội dung file bất thường hoặc có nguy cơ chứa mã độc.");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var baseFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "uploads-folder");
            var folderPath = string.IsNullOrWhiteSpace(subFolder)
                ? baseFolderPath
                : Path.Combine(baseFolderPath, subFolder);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);
            var filePath = Path.Combine(folderPath, fileName);

            using(var stream = new FileStream(filePath,FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            if (string.IsNullOrWhiteSpace(subFolder))
                return fileName;

            return Path.Combine(subFolder, fileName).Replace('\\', '/');
        }

        private async Task<bool> IsDangerousFileContentAsync(IFormFile file)
        {
            // Đọc 4 byte đầu tiên để kiểm tra signature của file thực thi (Executable/Script)
            using var stream = file.OpenReadStream();
            byte[] buffer = new byte[4];
            await stream.ReadAsync(buffer, 0, buffer.Length);

            // Header MZ (Windows Executable / DLL)
            if (buffer[0] == 0x4D && buffer[1] == 0x5A)
                return true;

            // Header ELF (Linux Executable)
            if (buffer[0] == 0x7F && buffer[1] == 0x45 && buffer[2] == 0x4C && buffer[3] == 0x46)
                return true;

            // Header Script bắt đầu bằng '#!' (Shell Script / Bash)
            if (buffer[0] == 0x23 && buffer[1] == 0x21)
                return true;

            return false;
        }
    }
}

namespace WebCTCPCKXLCTBinhAn.API.DTOs
{
    public class UngTuyenDTO
    {
        public int id_tuyen_dung { get; set; }
        public string ten { get; set; }
        public string? email { get; set; }
        public string? sdt { get; set; }
        public IFormFile? file { get; set; } = null!;
    }
}

namespace WebCTCPCKXLCTBinhAn.API.classes
{
    public class DuAn
    {
        public int id { get; set; }
        public string ten_du_an { get; set; }
        public string bo_nghia { get; set; }
        public string noi_dung { get; set; }
        public string hinh { get; set; }
        public string? ten_du_an_ta { get; set; }
        public string? bo_nghia_ta { get; set; }
        public string? noi_dung_ta { get; set; }
        public DateOnly? ngay_dang { get; set; }
        public string? hang_muc_thi_cong { get; set; }
        public string? chu_dau_tu { get; set; }
        public DateOnly? thoi_gian { get; set; }
    }
}

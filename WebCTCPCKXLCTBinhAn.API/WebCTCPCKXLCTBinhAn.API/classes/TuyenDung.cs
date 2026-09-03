namespace WebCTCPCKXLCTBinhAn.API.classes
{
    public class TuyenDung
    {
        public int id { get; set; }
        public string ten_cong_viec { get; set; }
        public string mo_ta { get; set; }
        public string noi_dung { get; set; }
        public string hinh { get; set; }
        public string dia_diem { get; set; }
        public DateOnly? ngay_bd_tuyen { get; set; }
        public DateOnly? ngay_kt_tuyen { get; set; }
        public string luong { get; set; }
    }
}

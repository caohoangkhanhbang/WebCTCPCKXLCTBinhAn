namespace WebCTCPCKXLCTBinhAn.API.classes
{
    public class UngTuyen
    {
        public int? id { get; set; }
        public int? id_tuyen_dung { get; set; }
        public string? ten { get; set; }
        public string? email { get; set; }
        public string? sdt { get; set; }
        public string? filecv { get; set; }
        public DateOnly? created_date { get; set; }
        public bool? da_xem { get; set; }
        public string? ten_cong_viec { get; set; }
    }
}

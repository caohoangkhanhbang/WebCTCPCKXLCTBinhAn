using Npgsql;
using WebCTCPCKXLCTBinhAn.API.classes;
using WebCTCPCKXLCTBinhAn.API.Services;

namespace WebCTCPCKXLCTBinhAn.API.Business
{
    public class BusinessHome(IConnectionService connectionService)
    {
        private readonly IConnectionService _connectionService = connectionService;
        public async Task<List<SlideHome>> GetSlideHome()
        {
            List<SlideHome> slideHomes = new List<SlideHome>();
            string sql = "SELECT id, hinh, noi_dung, bo_nghia FROM Slide_Home where hien_thi = true order by id desc ";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await con.OpenAsync();
            await using var cmd = new NpgsqlCommand(sql, con);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    slideHomes.Add(new SlideHome
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                        noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty,
                        bo_nghia = reader["bo_nghia"] != DBNull.Value ? reader["bo_nghia"].ToString() : string.Empty
                    });
                }

            }
            return slideHomes;
        }

        public async Task<List<DuAn>> GetDuAn()
        {
            List<DuAn> duAns = new List<DuAn>();
            string sql = @"SELECT id, ten_du_an, bo_nghia,
                                    noi_dung, hinh, ten_du_an_ta,
                                    bo_nghia_ta, noi_dung_ta
                         FROM du_an where hien_thi = true order by id desc";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await con.OpenAsync();
            await using var cmd = new NpgsqlCommand(sql, con);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    duAns.Add(new DuAn
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        ten_du_an = reader["ten_du_an"] != DBNull.Value ? reader["ten_du_an"].ToString() : string.Empty,
                        bo_nghia = reader["bo_nghia"] != DBNull.Value ? reader["bo_nghia"].ToString() : string.Empty,
                        noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty,
                        hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                        ten_du_an_ta = reader["ten_du_an_ta"] != DBNull.Value ? reader["ten_du_an_ta"].ToString() : string.Empty,
                        bo_nghia_ta = reader["bo_nghia_ta"] != DBNull.Value ? reader["bo_nghia_ta"].ToString() : string.Empty,
                        noi_dung_ta = reader["noi_dung_ta"] != DBNull.Value ? reader["noi_dung_ta"].ToString() : string.Empty
                    });
                }
            }
            return duAns;
        }

        public async Task<List<DuAn>> GetDuAnTieuBieu()
        {
            List<DuAn> duAns = new List<DuAn>();
            string sql = @"SELECT da.id, ten_du_an, bo_nghia,
                                    noi_dung, hinh, ten_du_an_ta,
                                    bo_nghia_ta, noi_dung_ta, da.loai_du_an
                            FROM public.du_an da    
                            inner join loai_du_an lda on da.loai_du_an = lda.id 
                            where lda.loai_du_an = 'Tiêu biểu' and da.hien_thi = true
                            ORDER BY da.id desc LIMIT 5";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await con.OpenAsync();
            await using var cmd = new NpgsqlCommand(sql, con);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    duAns.Add(new DuAn
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        ten_du_an = reader["ten_du_an"] != DBNull.Value ? reader["ten_du_an"].ToString() : string.Empty,
                        bo_nghia = reader["bo_nghia"] != DBNull.Value ? reader["bo_nghia"].ToString() : string.Empty,
                        noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty,
                        hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                        ten_du_an_ta = reader["ten_du_an_ta"] != DBNull.Value ? reader["ten_du_an_ta"].ToString() : string.Empty,
                        bo_nghia_ta = reader["bo_nghia_ta"] != DBNull.Value ? reader["bo_nghia_ta"].ToString() : string.Empty,
                        noi_dung_ta = reader["noi_dung_ta"] != DBNull.Value ? reader["noi_dung_ta"].ToString() : string.Empty
                    });
                }
            }
            return duAns;
        }

        public async Task<List<LoaiDuAn>> getLoaiDuAn()
        {
            List<LoaiDuAn> lst = new List<LoaiDuAn>();
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            string sql = "SELECT id, loai_du_an FROM loai_du_an where hien_thi = true order by id desc";
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    lst.Add(new LoaiDuAn
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        loai_du_an = reader["loai_du_an"] != DBNull.Value ? reader["loai_du_an"].ToString() : string.Empty
                    });
                }
            }
            return lst;
        }

        public async Task<List<CacCotMoc>> GetCacCotMoc()
        {
            List<CacCotMoc> lst = new List<CacCotMoc>();
            string sql = "SELECT id, thoi_gian, noi_dung FROM cac_cot_moc where hien_thi = true order by id asc";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    lst.Add(new CacCotMoc
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        thoi_gian = reader["thoi_gian"] != DBNull.Value ? reader["thoi_gian"].ToString() : string.Empty,
                        noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty
                    });
                }
            }
            return lst;
        }

        public async Task<List<GiaiPhap>> GetGiaiPhap()
        {
            List<GiaiPhap> lst = new List<GiaiPhap>();
            string sql = "SELECT id, giai_phap, hinh, hien_thi FROM giai_phap where hien_thi = true order by id asc limit 30";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    lst.Add(new GiaiPhap
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        giai_phap = reader["giai_phap"] != DBNull.Value ? reader["giai_phap"].ToString() : string.Empty,
                        hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                        hien_thi = reader["hien_thi"] != DBNull.Value ? Convert.ToBoolean(reader["hien_thi"]) : false
                    });
                }
            }
            return lst;
        }

        public async Task<List<GioiThieu>> GetGioiThieu()
        {
            List<GioiThieu> lst = new List<GioiThieu>();
            string sql = "SELECT id, noi_dung, hinh FROM gioi_thieu where hien_thi = true order by id desc limit 5";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    lst.Add(new GioiThieu
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty,
                        hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty
                    });
                }
            }
            return lst;
        }

        public async Task<List<TuyenDung>> GetTuyenDung()
        {
            List<TuyenDung> lst = new List<TuyenDung>();
            string sql = "SELECT id, noi_dung, hinh FROM tuyen_dung limit 5";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    lst.Add(new TuyenDung
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        ten_cong_viec = reader["ten_cong_viec"] != DBNull.Value ? reader["ten_cong_viec"].ToString() : string.Empty,
                        mo_ta = reader["mo_ta"] != DBNull.Value ? reader["mo_ta"].ToString() : string.Empty,
                        noi_dung = reader["noi_dung"] != DBNull.Value ? reader["noi_dung"].ToString() : string.Empty,
                        hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                        dia_diem = reader["dia_diem"] != DBNull.Value ? reader["dia_diem"].ToString() : string.Empty,
                        ngay_bd_tuyen = reader["ngay_bd_tuyen"] != DBNull.Value ? (DateOnly)reader["ngay_bd_tuyen"] : (DateOnly?)null,
                        ngay_kt_tuyen = reader["ngay_kt_tuyen"] != DBNull.Value ? (DateOnly?)reader["ngay_kt_tuyen"] : null,
                        luong = reader["luong"] != DBNull.Value ? reader["luong"].ToString() : string.Empty
                    });
                }
            }
            return lst;
        }

        public async Task<ThongTinCongTy> getThongTinCongTy()
        {
            ThongTinCongTy data = new ThongTinCongTy();
            string sql = "SELECT id, ten_cty, logo, dia_chi, email, sdt, hinh, slogan, linh_vuc, nam_thanh_lap FROM thong_tin_cty where hien_thi = true limit 1 ";
            await using var con = new NpgsqlConnection(_connectionService.GetConnectionString());
            await using var cmd = new NpgsqlCommand(sql, con);
            await con.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                    return new ThongTinCongTy
                    {
                        id = reader["id"] != DBNull.Value ? Convert.ToInt32(reader["id"]) : 0,
                        ten_cty = reader["ten_cty"] != DBNull.Value ? reader["ten_cty"].ToString() : string.Empty,
                        logo = reader["logo"] != DBNull.Value ? reader["logo"].ToString() : string.Empty,
                        dia_chi = reader["dia_chi"] != DBNull.Value ? reader["dia_chi"].ToString() : string.Empty,
                        email = reader["email"] != DBNull.Value ? reader["email"].ToString() : string.Empty,
                        sdt = reader["sdt"] != DBNull.Value ? reader["sdt"].ToString() : string.Empty,
                        hinh = reader["hinh"] != DBNull.Value ? reader["hinh"].ToString() : string.Empty,
                        slogan = reader["slogan"] != DBNull.Value ? reader["slogan"].ToString() : string.Empty,
                        linh_vuc = reader["linh_vuc"] != DBNull.Value ? reader["linh_vuc"].ToString() : string.Empty,
                        nam_thanh_lap = reader["nam_thanh_lap"] != DBNull.Value ? (DateOnly?)reader["nam_thanh_lap"] : null
                    };
            }
            return data;
        }


    }
}

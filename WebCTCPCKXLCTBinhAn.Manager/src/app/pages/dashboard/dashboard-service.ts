import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';

export class DashboardService {
    private readonly apiUrl = environment.apiUrl + '/Dashboard';
    private readonly http = inject(HttpClient);

    TongSoDuAn() {
        return this.http.get<number>(`${this.apiUrl}/tong-so-du-an`);
    }

    SoLinhVucHoatDong() {
        return this.http.get<number>(`${this.apiUrl}/so-linh-vuc-hoat-dong`);
    }

    SoNguoiLienHeTrongThang() {
        return this.http.get<number>(`${this.apiUrl}/so-nguoi-lien-he-trong-thang`);
    }

    SoUngVienViecLamTrongThang() {
        return this.http.get<number>(`${this.apiUrl}/so-ung-vien-viec-lam-trong-thang`);
    }

    ListNguoiLienHeTrongThang() {
        return this.http.get<any[]>(`${this.apiUrl}/list-nguoi-lien-he-trong-thang`);
    }

    ListUngVienViecLamTrongThang() {
        return this.http.get<any[]>(`${this.apiUrl}/list-ung-vien-viec-lam-trong-thang`);
    }
}
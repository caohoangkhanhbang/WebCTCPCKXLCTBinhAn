import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class MainLayoutServices {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/Home`;

    getThongTinCongTy(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/thong-tin-cong-ty`);
    }

    getGiaiPhap(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/giai-phap`);
    }

}
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
    providedIn: 'root'
})
export class ShareServices {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}`;

    getThongTinCongTy(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/ThongTinCongTy/list`);
    }

    getHinhNen(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Home/hinh-nen`);
    }
}
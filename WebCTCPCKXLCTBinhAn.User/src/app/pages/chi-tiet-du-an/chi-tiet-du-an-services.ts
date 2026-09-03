import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
export class ChiTietDuAnServices {
    http = inject(HttpClient);
    readonly apiUrl = `${environment.apiUrl}/DuAn`;
    readonly cdnUrl = environment.cdnUrl;
    getChiTietDuAn(id: string | number) {
        return this.http.get<any>(`${this.apiUrl}/get-du-an/${id}`);
    }
}
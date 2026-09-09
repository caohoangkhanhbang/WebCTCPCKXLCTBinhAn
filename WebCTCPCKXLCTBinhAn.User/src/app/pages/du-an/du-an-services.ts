import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
export class DuAnServices {
    readonly apiUrl = `${environment.apiUrl}/DuAn`;
    readonly cdnUrl = environment.cdnUrl;
    http = inject(HttpClient);

    searchDuAn(query: string) {
        return this.http.get<any[]>(`${this.apiUrl}/get-du-an`, { params: { query: query } });
    }

    getData(query: string, lastId: number, pageSize: number) {
        return this.http.get<any[]>(`${this.apiUrl}/get-du-an`, { params: { query, lastId, pageSize } });
    }

}

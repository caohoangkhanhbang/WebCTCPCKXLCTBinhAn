import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export class GioiThieuService {
    private readonly apiUrl = environment.apiUrl;
    http = inject(HttpClient);
    list(page: number, pageSize: number, search: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/gioithieu/list`,{ params: { page, pageSize, search } });
    }

}
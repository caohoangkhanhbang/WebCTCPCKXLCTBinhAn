import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export class GioiThieuService {
    private readonly apiUrl = environment.apiUrl+'/gioithieu';
    http = inject(HttpClient);
    list(page: number, pageSize: number, search: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/list`, { params: { page, pageSize, search } });
    }

    getById(id: number | null): Observable<any> {
        return this.http.get(`${this.apiUrl}/cac-cot-moc/${id}`);
    }

    insert(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/insert`, data);
    }

    update(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/update/${id}`, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }

}
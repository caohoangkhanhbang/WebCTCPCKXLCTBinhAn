import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs/internal/Observable';

export class HomeService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Home`;

    getCacCotMoc(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/cac-cot-moc`);
    }

    getDuAn(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/du-an`);
    }

    getGiaiPhap(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/giai-phap`);
    }
}
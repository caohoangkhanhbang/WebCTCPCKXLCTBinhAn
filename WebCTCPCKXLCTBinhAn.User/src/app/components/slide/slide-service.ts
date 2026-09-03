import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Slide } from './slide-model';
import { environment } from '../../../enviroments/enviroment';

export class SlideService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Home`;

    getSlideHome(): Observable<Slide[]> {
        return this.http.get<Slide[]>(`${this.apiUrl}/slide-home`);
    }
}

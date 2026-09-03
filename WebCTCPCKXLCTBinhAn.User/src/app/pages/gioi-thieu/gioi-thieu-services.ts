import { inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
export class GioiThieuServices {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/GioiThieu`;
    getCacCotMoc(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/cac-cot-moc`);
    }
}
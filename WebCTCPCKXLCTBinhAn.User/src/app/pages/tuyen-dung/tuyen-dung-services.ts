import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export class TuyenDungServices {
    http = inject(HttpClient);
    apiUrl = environment.apiUrl + '/TuyenDung';

    submitUngTuyen(formData: FormData): Observable<any> {
        return this.http.post(this.apiUrl + '/post-ung-tuyen', formData);
    }

    GetTuyenDung(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
}
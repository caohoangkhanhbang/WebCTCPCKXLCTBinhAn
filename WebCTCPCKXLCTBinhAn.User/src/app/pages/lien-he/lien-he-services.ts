import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class LienHeServices {
    apiUrl = environment.apiUrl + '/LienHe';
    cdnUrl = environment.cdnUrl;
    http = inject(HttpClient);

    submitLienHe(data: any) {
        return this.http.post(this.apiUrl, data);
    }
}
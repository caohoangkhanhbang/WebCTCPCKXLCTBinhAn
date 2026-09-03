import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../enviroments/enviroment";
import { Observable } from "rxjs/internal/Observable";

export class SlideDuAnServices {
    http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Home`;

    getDuAnTieuBieu(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/du-an-tieu-bieu`);
    }
}
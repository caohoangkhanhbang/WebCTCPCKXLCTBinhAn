import { inject } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
export class LienHeService {
    apiUrl = environment.apiUrl + '/LienHe';
    http = inject(HttpClient);

    getList(page: number, pageSize: number, search: string) {
        return this.http.get(`${this.apiUrl}`, { params: { page, pageSize, search } });
    }

    update(id: number, data: any) {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

}
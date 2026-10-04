import { inject } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
export class TuyenDungService {
    apiUrl = environment.apiUrl + '/TuyenDung';
    http = inject(HttpClient);

    getList(page: number, pageSize: number, search: string) {
        return this.http.get(`${this.apiUrl}/list`, { params: { page, pageSize, search } });
    }

    getById(id: number | null) {
        return this.http.get<any>(`${this.apiUrl}/tuyen-dung/${id}`);
    }

    insert(data: any) {
        return this.http.post(`${this.apiUrl}/insert`, data);
    }

    update(id: number, data: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, data);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }

}
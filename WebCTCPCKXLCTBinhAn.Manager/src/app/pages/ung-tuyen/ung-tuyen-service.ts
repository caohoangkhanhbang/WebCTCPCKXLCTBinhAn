import { inject } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
export class UngTuyenService {
    apiUrl = environment.apiUrl + '/UngTuyen';
    apiUrlTuyenDung = environment.apiUrl + '/TuyenDung';
    http = inject(HttpClient);

    getList(page: number, pageSize: number, search: string) {
        return this.http.get(`${this.apiUrl}`, { params: { page, pageSize, search } });
    }

    getById(id: number | null) {
        return this.http.get<any>(`${this.apiUrlTuyenDung}/tuyen-dung/${id}`);
    }

    update(id: number, data: any) {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

}
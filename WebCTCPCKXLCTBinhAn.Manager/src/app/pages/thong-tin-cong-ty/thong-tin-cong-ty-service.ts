import { inject } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
export class ThongTinCongTyService {
    apiUrl = environment.apiUrl + '/ThongTinCongTy';
    http = inject(HttpClient);

    getList() {
        return this.http.get<any>(`${this.apiUrl}/list`);
    }

    insert(data: any) {
        return this.http.post(`${this.apiUrl}/insert`, data);
    }

    update(id: number | null, data: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, data);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }

}
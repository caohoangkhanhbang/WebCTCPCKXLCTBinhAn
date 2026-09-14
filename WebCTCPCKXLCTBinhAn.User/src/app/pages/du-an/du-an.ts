import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DuAnServices } from "./du-an-services";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { environment } from "../../../enviroments/enviroment";
import { RouterLink } from "@angular/router";
import { switchMap } from "rxjs/internal/operators/switchMap";
import { ScrollNearEndDirective } from "./scroll-near-end.directive";
import { tap } from "rxjs/internal/operators/tap";
import { CompanyInfo } from "../../Services/company-info";
@Component({
    selector: "app-du-an",
    templateUrl: "./du-an.html",
    styleUrl: "./du-an.css",
    standalone: true,
    imports: [TranslatePipe, RouterLink, ScrollNearEndDirective],
    providers: [DuAnServices]
})

export class DuAn {
    router = inject(ActivatedRoute);
    service = inject(DuAnServices);
    readonly cdnUrl = environment.cdnUrl;
    data = signal<any[]>([]);
    nextCursor = signal<number>(0);
    hasNextPage = signal<boolean>(true);
    loading = signal<boolean>(false);
    readonly pageSize = 10;
    currentQuery = signal<string>("");
    companyInfo = inject(CompanyInfo);
    thongTinCty = this.companyInfo.thongTinCty;

    private routerParamsSignal = toSignal(
        this.router.queryParamMap.pipe(
            tap((params) => {
                // Reset data when query changes
                const query = params.get("query") || "";
                this.currentQuery.set(query);
                this.data.set([]);
                this.nextCursor.set(0);
                this.hasNextPage.set(true);
            }),
            switchMap((params) => {
                const query = params.get("query") || '';
                this.loading.set(true);
                return this.service.getData(query, 0, this.pageSize);
            }),
            tap({
                next: (res: any) => {
                    this.data.set(res.data);
                    this.nextCursor.set(res.nextCursor);
                    this.hasNextPage.set(res.hasNextPage);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            })
        )
    );

    loadData(): void {
        if (this.loading() || !this.hasNextPage()) return;
        this.loading.set(true);

        this.service.getData(this.currentQuery(), this.nextCursor(), this.pageSize).subscribe({
            next: (res: any) => {
                this.data.update(prev => [...prev, ...res.data]);
                this.nextCursor.set(res.nextCursor);
                this.hasNextPage.set(res.hasNextPage);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        }
        )
    }

    loadMore(): void {
        this.loadData();
    }
}

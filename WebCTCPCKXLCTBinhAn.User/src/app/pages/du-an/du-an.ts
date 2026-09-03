import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DuAnServices } from "./du-an-services";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { environment } from "../../../enviroments/enviroment";
import { RouterLink } from "@angular/router";
import { switchMap } from "rxjs/internal/operators/switchMap";
@Component({
    selector: "app-du-an",
    templateUrl: "./du-an.html",
    styleUrl: "./du-an.css",
    standalone: true,
    imports: [TranslatePipe, RouterLink],
    providers: [DuAnServices]
})

export class DuAn {
    router = inject(ActivatedRoute);
    service = inject(DuAnServices);
    readonly cdnUrl = environment.cdnUrl;
    data = toSignal(
        this.router.queryParamMap.pipe(
            switchMap((params) => {
                const query = params.get("query") || "";
                return this.service.searchDuAn(query);
            })
        )
    );

}
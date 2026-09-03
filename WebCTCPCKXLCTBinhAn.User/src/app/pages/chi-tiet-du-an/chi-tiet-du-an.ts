import { Component, inject, input } from '@angular/core';
import { ChiTietDuAnServices } from './chi-tiet-du-an-services';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/internal/operators/switchMap';
@Component({
    selector: 'app-chi-tiet-du-an',
    templateUrl: './chi-tiet-du-an.html',
    standalone: true,
    styleUrl: './chi-tiet-du-an.css',
    providers: [ChiTietDuAnServices]
})

export class ChiTietDuAn {
    service = inject(ChiTietDuAnServices);

    id = input.required<string>();
    data = toSignal(
        toObservable(this.id).pipe(
            switchMap(idValue => this.service.getChiTietDuAn(idValue))
        )
    );

}
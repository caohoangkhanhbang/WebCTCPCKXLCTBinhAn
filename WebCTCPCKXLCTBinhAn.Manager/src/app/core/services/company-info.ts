import { inject, Injectable, signal } from '@angular/core';
import { ShareServices } from './share-services';
import { toSignal } from '@angular/core/rxjs-interop';
@Injectable({
    providedIn: 'root'
})
export class CompanyInfo {
    private shareService = inject(ShareServices);
    readonly thongTinCty = toSignal(this.shareService.getThongTinCongTy(), { initialValue: undefined as any });
}
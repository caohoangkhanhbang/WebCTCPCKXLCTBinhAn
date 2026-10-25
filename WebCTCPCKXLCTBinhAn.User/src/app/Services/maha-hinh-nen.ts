import { inject } from '@angular/core';
import { ShareServices } from './share-services';
import { toSignal } from '@angular/core/rxjs-interop';

export class MahaHinhNen {
    private shareService = inject(ShareServices);
    readonly hinhNen = toSignal(this.shareService.getHinhNen(), { initialValue: [] as any });
}
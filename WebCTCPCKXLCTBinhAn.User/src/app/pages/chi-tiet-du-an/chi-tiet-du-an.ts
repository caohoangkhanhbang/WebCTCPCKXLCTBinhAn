import { Component, inject, input } from '@angular/core';
import { ChiTietDuAnServices } from './chi-tiet-du-an-services';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { environment } from '../../../enviroments/enviroment';
import { computed } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MahaHinhNen } from '../../Services/maha-hinh-nen';

@Component({
    selector: 'app-chi-tiet-du-an',
    templateUrl: './chi-tiet-du-an.html',
    standalone: true,
    styleUrl: './chi-tiet-du-an.css',
    providers: [ChiTietDuAnServices, MahaHinhNen],
    imports: [RouterLink, DatePipe, TranslatePipe]
})

export class ChiTietDuAn {
    service = inject(ChiTietDuAnServices);
    readonly cdnUrl = environment.cdnUrl;
    id = input.required<string>();

    private sanitizer = inject(DomSanitizer);
    noiDungHtml = computed<SafeHtml | null>(() => {
        const html = this.data()?.noi_dung;
        if (!html) {
            return null;
        }
        return this.sanitizer.bypassSecurityTrustHtml(html);
    });

    data = toSignal(
        toObservable(this.id).pipe(
            switchMap(idValue => this.service.getChiTietDuAn(idValue))
        )
    );

    // Chia sẻ bài viết lên mạng xã hội
    readonly shareUrl = computed(() => `${environment.shareUrl}/du-an/${this.id()}`);
    readonly facebookUrl = computed(() =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl())}`
    );
    readonly zaloShareUrl = computed(() =>
        `https://sp.zalo.me/share_inline?url=${encodeURIComponent(this.shareUrl())}`
    );

    hinhNenInfo = inject(MahaHinhNen).hinhNen;
    backgroundPath = computed(() =>
        this.hinhNenInfo().filter((item: any) => item.ten_trang.trim().toLowerCase() === 'chi tiết dự án').slice(-2)
    );
    CombineUrl(path: string): string {
        return `${environment.cdnUrl}/` + path;
    }

}
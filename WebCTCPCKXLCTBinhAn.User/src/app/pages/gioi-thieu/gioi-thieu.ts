import { Component, inject, computed } from '@angular/core';
import { CompanyInfo } from '../../Services/company-info';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GioiThieuServices } from './gioi-thieu-services';
import { MahaHinhNen } from '../../Services/maha-hinh-nen';
import { environment } from '../../../enviroments/enviroment';


@Component({
  selector: 'app-gioi-thieu',
  imports: [TranslatePipe],
  templateUrl: './gioi-thieu.html',
  styleUrl: './gioi-thieu.css',
  providers: [GioiThieuServices, MahaHinhNen]
})
export class GioiThieu {
  service = inject(GioiThieuServices);
  companyInfo = inject(CompanyInfo);
  thongTinCty = this.companyInfo.thongTinCty;

  hinhNenInfo = inject(MahaHinhNen).hinhNen;
  backgroundPath = computed(() =>
    this.hinhNenInfo().filter((item: any) => item.ten_trang.trim().toLowerCase() === 'giới thiệu').slice(-2)
  );
  CombineUrl(path: string): string {
    return `${environment.cdnUrl}/` + path;
  }

  readonly cacCotMoc = toSignal(this.service.getCacCotMoc(), { initialValue: [] as any[] });
}

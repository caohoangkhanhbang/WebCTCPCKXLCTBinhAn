import { Component, inject } from '@angular/core';
import { CompanyInfo } from '../../Services/company-info';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GioiThieuServices } from './gioi-thieu-services';

@Component({
  selector: 'app-gioi-thieu',
  imports: [TranslatePipe],
  templateUrl: './gioi-thieu.html',
  styleUrl: './gioi-thieu.css',
  providers: [GioiThieuServices]
})
export class GioiThieu {
  service = inject(GioiThieuServices);
  companyInfo = inject(CompanyInfo);
  thongTinCty = this.companyInfo.thongTinCty;
  readonly cacCotMoc = toSignal(this.service.getCacCotMoc(), { initialValue: [] as any[] });
}

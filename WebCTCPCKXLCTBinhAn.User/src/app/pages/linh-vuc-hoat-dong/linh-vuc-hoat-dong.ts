import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HomeService } from '../home/home-services';
import { environment } from '../../../enviroments/enviroment';
import { TranslatePipe } from '@ngx-translate/core';
import { CompanyInfo } from '../../Services/company-info';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-linh-vuc-hoat-dong',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './linh-vuc-hoat-dong.html',
  styleUrl: './linh-vuc-hoat-dong.css',
  providers: [HomeService]

})
export class LinhVucHoatDong {
  service = inject(HomeService);
  readonly cdnUrl = environment.cdnUrl;
  companyInfo = inject(CompanyInfo);
  thongTinCty = this.companyInfo.thongTinCty;

  readonly giaiPhap = toSignal(this.service.getGiaiPhap(), { initialValue: [] as any[] });

}

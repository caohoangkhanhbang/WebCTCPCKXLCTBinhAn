import { Component, inject, signal } from '@angular/core';
import { SlideComponent } from '../../components/slide/slide';
import { SlideDuAn } from '../../components/slide-du-an/slide-du-an';
import { HomeService } from './home-services';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../enviroments/enviroment';
import { RouterLink } from '@angular/router';
import { CompanyInfo } from '../../Services/company-info';

@Component({
  selector: 'app-home',
  imports: [SlideComponent, SlideDuAn, TranslatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
  providers: [HomeService]
})
export class Home {
  service = inject(HomeService);
  readonly cdnUrl = environment.cdnUrl;
  companyInfo = inject(CompanyInfo);
  thongTinCty = this.companyInfo.thongTinCty;
  readonly cacCotMoc = toSignal(this.service.getCacCotMoc(), { initialValue: [] as any[] });
  readonly duAn = toSignal(this.service.getDuAn(), { initialValue: [] as any[] });
  readonly giaiPhap = toSignal(this.service.getGiaiPhap(), { initialValue: [] as any[] });

  
}


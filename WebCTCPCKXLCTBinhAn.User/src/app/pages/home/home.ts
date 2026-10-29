import { Component, inject, computed } from '@angular/core';
import { SlideComponent } from '../../components/slide/slide';
import { SlideDuAn } from '../../components/slide-du-an/slide-du-an';
import { HomeService } from './home-services';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../enviroments/enviroment';
import { RouterLink } from '@angular/router';
import { CompanyInfo } from '../../Services/company-info';
import { MahaHinhNen } from '../../Services/maha-hinh-nen';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [SlideComponent, SlideDuAn, TranslatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
  providers: [HomeService, MahaHinhNen]
})
export class Home {
  service = inject(HomeService);
  readonly cdnUrl = environment.cdnUrl;
  companyInfo = inject(CompanyInfo);
  thongTinCty = this.companyInfo.thongTinCty;
  readonly cacCotMoc = toSignal(this.service.getCacCotMoc(), { initialValue: [] as any[] });
  readonly duAn = toSignal(this.service.getDuAn(), { initialValue: [] as any[] });
  readonly giaiPhap = toSignal(this.service.getGiaiPhap(), { initialValue: [] as any[] });

  hinhNenInfo = inject(MahaHinhNen).hinhNen;
  backgroundPath = computed(() => this.FilterListImage('lĩnh vực hoạt động', 2));
  backgroundPathGioiThieu = computed(() => this.FilterListImage('nội dung giới thiệu', 4));

  FilterListImage(pageName: string, numberOfImages: number): any[] {
    return (this.hinhNenInfo() ?? []).filter((item: any) => item.ten_trang.trim().toLowerCase() === pageName.toLowerCase()).slice(-numberOfImages);
  }
  CombineUrl(path: string): string {
    return `${environment.cdnUrl}/` + path;
  }

  private sanitizer = inject(DomSanitizer);
  noiDungHtml = computed<SafeHtml | null>(() => {
    const html = this.thongTinCty()?.html_gioi_thieu;
    if (!html) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });
}


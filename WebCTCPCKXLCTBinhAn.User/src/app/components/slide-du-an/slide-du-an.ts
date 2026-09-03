import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SlideDuAnServices } from './slide-dua-an-sercices';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-slide-du-an',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './slide-du-an.html',
  styleUrl: './slide-du-an.css',
  providers: [SlideDuAnServices]
})
export class SlideDuAn {

  private service = inject(SlideDuAnServices);
  // slidesMock: any[] = [
  //   { image: '/resource/images/slide1.png', title: 'Chất Lượng Trong Từng Cấu Kiện – Uy Tín Trên Mọi Công Trình', modify: 'Chuyên gia trong lĩnh vực gia công cơ khí kết cấu thép, sản xuất bê tông, thi công hạ tầng giao thông và lắp đặt công trình công nghiệp chuyên nghiệp.' },
  //   { image: '/resource/images/slide2.png', title: 'Slide 2', modify: '' },
  //   { image: '/resource/images/slide3.png', title: 'Chất Lượng Trong Từng Cấu Kiện – Uy Tín Trên Mọi Công Trình', modify: 'Bản vẽ siêu độc đáo từ AI' },
  //   { image: 'https://tech.cornell.edu/wp-content/uploads/2018/06/TECH_20161019_001_1440_1080_s_c1.jpg', title: 'Chất Lượng Trong Từng Cấu Kiện – Uy Tín Trên Mọi Công Trình', modify: 'Bản vẽ siêu độc đáo từ AI' },
  //   { image: 'https://tech.cornell.edu/wp-content/uploads/2018/06/Tata_Innovation_Center_1_2.jpg', title: 'Chất Lượng Trong Từng Cấu Kiện – Uy Tín Trên Mọi Công Trình', modify: 'Bản vẽ siêu độc đáo từ AI' },
  //   { image: 'https://tech.cornell.edu/wp-content/uploads/2018/06/TECH_20170717_002_1440_1080_s_c1.jpg', title: 'Chất Lượng Trong Từng Cấu Kiện – Uy Tín Trên Mọi Công Trình', modify: 'Bản vẽ siêu độc đáo từ AI' },
  // ];
  readonly cdnUrl = environment.cdnUrl;


  data = toSignal(this.service.getDuAnTieuBieu(), { initialValue: [] as any[] });

  currentIndex = 0;

  onPrevClick() {
    this.currentIndex = (this.currentIndex === 0) ? this.data().length - 1 : this.currentIndex - 1;
  }

  onNextClick() {
    this.currentIndex = (this.currentIndex === this.data().length - 1) ? 0 : this.currentIndex + 1;
  }

}

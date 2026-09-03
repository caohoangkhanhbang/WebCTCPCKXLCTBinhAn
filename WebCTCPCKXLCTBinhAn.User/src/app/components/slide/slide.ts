import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SlideService } from './slide-service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Slide } from './slide-model';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-slide',
  standalone: true,
  imports: [],
  templateUrl: './slide.html',
  styleUrl: './slide.css',
  providers: [SlideService]
})
export class SlideComponent implements OnInit, OnDestroy {
  slidesData: Slide[] = [];
  readonly cdnUrl = environment.cdnUrl;
  extendedSlides: Slide[] = [];
  currentIndex = 1;
  isTransitioning = true;
  private isAnimating = false;
  private autoPlayTimer: any = null;
  private readonly AUTO_PLAY_INTERVAL = 3000;

  private service = inject(SlideService);
  private subscription?: Subscription;

  ngOnInit(): void {
    this.getData();
  }



  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  getData() {
    this.subscription = this.service.getSlideHome().subscribe({
      next: (data) => {
        this.slidesData = data;
        if (this.slidesData.length > 0) {
          const firstSlide = this.slidesData[0];
          const lastSlide = this.slidesData[this.slidesData.length - 1];
          this.extendedSlides = [lastSlide, ...this.slidesData, firstSlide];
        }
        this.startAutoPlay();
      },
      error: (error) => { console.error('Lỗi lấy slide:', error) }
    })
  }
  // Khởi chạy đếm giờ
  startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, this.AUTO_PLAY_INTERVAL);
  }

  // Tạm dừng đếm giờ
  stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  nextSlide(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.isTransitioning = true;
    this.currentIndex++;
  }

  prevSlide(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.isTransitioning = true;
    this.currentIndex--;
  }

  // Xử lý nút bấm thủ công: reset lại đếm giờ 3s từ đầu
  onManualNext(): void {
    this.nextSlide();
    this.startAutoPlay();
  }

  onManualPrev(): void {
    this.prevSlide();
    this.startAutoPlay();
  }

  onTransitionEnd(): void {
    this.isAnimating = false;

    // Nhảy âm thầm từ slide ảo về slide thật tương ứng
    if (this.currentIndex === this.extendedSlides.length - 1) {
      this.isTransitioning = false;
      this.currentIndex = 1;
    }

    if (this.currentIndex === 0) {
      this.isTransitioning = false;
      this.currentIndex = this.extendedSlides.length - 2;
    }
  }
}
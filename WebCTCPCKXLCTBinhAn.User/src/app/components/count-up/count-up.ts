import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-count-up',
  standalone: true,
  templateUrl: './count-up.html',
  styleUrl: './count-up.css'
})
export class CountUpComponent implements OnInit, OnDestroy {
  @Input() targetNumber = 100; // Số mục tiêu (mặc định là 100)
  @Input() duration = 2000;    // Thời gian chạy hết hiệu ứng (ms) - ví dụ 2 giây

  currentDisplayNumber = 1;    // Số hiển thị trên giao diện
  private animationFrameId: number | null = null;

  ngOnInit(): void {
    this.startCountUp();
  }

  ngOnDestroy(): void {
    // Hủy animation nếu người dùng chuyển trang giữa chừng để tránh rò rỉ bộ nhớ
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startCountUp(): void {
    const startNumber = 1;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;

      // Tính tỉ lệ phần trăm thời gian trôi qua (tối đa là 1)
      const progress = Math.min(elapsedTime / this.duration, 1);

      // Tính số hiện tại dựa trên tỉ lệ progress
      this.currentDisplayNumber = Math.floor(
        startNumber + (this.targetNumber - startNumber) * progress
      );

      // Nếu chưa hết thời gian duration, tiếp tục vẽ khung hình tiếp theo
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.currentDisplayNumber = this.targetNumber; // Đảm bảo chốt đúng số target
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}
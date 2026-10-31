import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileResponse } from '../../core/models/auth.model';
import { DatePipe } from '@angular/common';
import { DashboardService } from './dashboard-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
  providers: [DashboardService]
})
export class Dashboard implements OnInit {
  profile: ProfileResponse | null = null;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly services = inject(DashboardService);

  ngOnInit(): void {
    console.log('Một sản phẩm của CHKB ToT');
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: profile => {
        this.profile = profile;
      },
      error: error => {
        console.error('Error loading profile:', error);
        if (error.status === 401) {
          this.logout();
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  lienHeColumns = [{ name: 'STT' }, { name: 'Họ và tên' }, { name: 'Nội dung trao đổi' }, { name: 'Ngày liên hệ' }];
  ungTuyenColumns = [{ name: 'STT' }, { name: 'Người ứng tuyển' }, { name: 'Ứng tuyển vào' }, { name: 'Ngày ứng tuyển' }];
  lienHeData = toSignal(this.services.ListNguoiLienHeTrongThang(), { initialValue: [] });
  ungTuyenData = toSignal(this.services.ListUngVienViecLamTrongThang(), { initialValue: [] });
  soDuAn = toSignal(this.services.TongSoDuAn(), { initialValue: 0 });
  soLinhVuc = toSignal(this.services.SoLinhVucHoatDong(), { initialValue: 0 });
  soNguoiLienHe = toSignal(this.services.SoNguoiLienHeTrongThang(), { initialValue: 0 });
  soUngVien = toSignal(this.services.SoUngVienViecLamTrongThang(), { initialValue: 0 });

}

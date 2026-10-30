import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileResponse } from '../../core/models/auth.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard implements OnInit {
  profile: ProfileResponse | null = null;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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

  lienHeData = signal<any[]>([]);
  ungTuyenData = signal<any[]>([]);
}

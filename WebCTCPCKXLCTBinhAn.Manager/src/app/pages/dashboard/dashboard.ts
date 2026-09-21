import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileResponse } from '../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard implements OnInit {
  profile: ProfileResponse | null = null;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void { }

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
}

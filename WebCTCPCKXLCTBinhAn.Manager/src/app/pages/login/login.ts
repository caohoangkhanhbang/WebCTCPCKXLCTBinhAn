import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment.development';
import { CompanyInfo } from '../../core/services/company-info';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = signal('');
  isLoading = signal(false);
  cdnUrl = environment.cdnUrl;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login(): void {
    this.isLoading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.isLoading.set(false);
        console.error('Login error:', error);
        if (error.status === 401) {
          this.errorMessage.set("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
          this.isLoading.set(false);
        }
        else {
          this.isLoading.set(false);
          this.errorMessage.set("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        }
      }
    });
  }

  companyInfo = inject(CompanyInfo).thongTinCty;
}


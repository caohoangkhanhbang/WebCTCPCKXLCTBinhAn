import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.isLoading = false;
        console.error('Login error:', error);
        if (error.status === 401) {
          this.errorMessage = "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";
        }
        else {
          this.errorMessage = "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
        }
      }
    });
  }
}


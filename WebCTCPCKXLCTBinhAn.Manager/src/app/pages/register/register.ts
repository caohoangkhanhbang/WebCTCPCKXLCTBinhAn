import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  private readonly authService = inject(AuthService);

  fullName = '';
  email = '';
  password = '';

  register() {
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: response => {
        console.log(response);
        alert('Đăng ký thành công');
      },
      error: error => {
        console.error(error);
        alert(error.error?.message ?? 'Đăng ký thất bại');
      }
    });
  }
}
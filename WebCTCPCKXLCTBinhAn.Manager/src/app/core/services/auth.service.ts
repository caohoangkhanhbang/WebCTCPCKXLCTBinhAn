import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthResponse, LoginRequest, RegisterRequest, ProfileResponse } from '../models/auth.model';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = environment.apiUrl + '/auth';
    private readonly tokenKey = 'access_token';
    private readonly loggedIn = signal(this.hasToken());
    readonly isLoggedIn = this.loggedIn.asReadonly();
    private readonly http = inject(HttpClient);
    router = inject(Router);

    constructor() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'logout-event') {
                sessionStorage.removeItem(this.tokenKey);
                this.loggedIn.set(false);
                // Chuyển về trang đăng nhập
                this.router.navigate(['/login']);
            }
        });
    }

    // Đăng nhập
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                sessionStorage.setItem(this.tokenKey, response.AccessToken);
                this.loggedIn.set(true);
            })
        )
    }

    // Đăng ký
    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
    }

    // get token
    getToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }

    // check login
    private hasToken(): boolean {
        return !!this.getToken();
    }

    // get profile
    getProfile(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(`${this.apiUrl}/profile`);
    }

    // logout
    logout(): void {
        sessionStorage.removeItem(this.tokenKey);
        this.loggedIn.set(false);
        // Phát tín hiệu để các tab khác đăng xuất
        localStorage.setItem('logout-event', Date.now().toString());
        this.router.navigate(['/login']);
    }

}

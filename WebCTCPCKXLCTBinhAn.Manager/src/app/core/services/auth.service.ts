import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthResponse, LoginRequest, RegisterRequest, ProfileResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = environment.apiUrl + '/auth';
    private readonly tokenKey = 'access_token';
    private readonly loggedIn = signal(this.hasToken());
    readonly isLoggedIn = this.loggedIn.asReadonly();
    private readonly http = inject(HttpClient);

    // Đăng nhập
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                sessionStorage.setItem(this.tokenKey, response.accessToken);
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
    }

}

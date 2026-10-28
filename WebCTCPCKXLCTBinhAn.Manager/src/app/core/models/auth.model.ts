export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    AccessToken: string;
    ExpiresAt: string;
    FullName: string;
    Role: string;
}

export interface ProfileResponse {
    userId: string;
    fullName: string;
    role: string;
}
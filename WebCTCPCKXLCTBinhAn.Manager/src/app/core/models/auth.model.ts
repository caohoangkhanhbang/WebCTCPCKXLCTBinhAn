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
    accessToken: string;
    expiresAt: string;
    fullName: string;
    role: string;
}

export interface ProfileResponse {
    userId: string;
    fullName: string;
    role: string;
}
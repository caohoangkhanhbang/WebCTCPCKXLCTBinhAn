import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: '',
        loadComponent: () => import('./layouts/main-layout').then(m => m.MainLayout),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'tong-quan',
                title: 'Tổng quan',
                loadComponent: () => import('./pages/tong-quan/tong-quan').then(m => m.TongQuan),
                canActivate: [authGuard]
            },
            {
                path: 'gioi-thieu',
                title: 'Giới thiệu',
                loadComponent: () => import('./pages/gioi-thieu/gioi-thieu').then(m => m.GioiThieu),
                canActivate: [authGuard]
            },
            {
                path: 'register',
                title: 'Đăng ký',
                loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent),
                canActivate: [authGuard]
            },
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

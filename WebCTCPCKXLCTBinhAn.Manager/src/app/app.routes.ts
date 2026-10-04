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
                path: 'linh-vuc-hoat-dong',
                title: 'Lĩnh vực hoạt động',
                loadComponent: () => import('./pages/linh-vuc-hoat-dong/linh-vuc-hoat-dong').then(m => m.LinhVucHoatDong),
                canActivate: [authGuard]
            },
            {
                path: 'du-an',
                title: 'Dự án',
                loadComponent: () => import('./pages/du-an/du-an').then(m => m.DuAn),
                canActivate: [authGuard]
            },
            {
                path: 'tuyen-dung',
                title: 'Tuyển dụng',
                loadComponent: () => import('./pages/tuyen-dung/tuyen-dung').then(m => m.TuyenDung),
                canActivate: [authGuard]
            },
            {
                path: 'thong-tin-cong-ty',
                title: 'Thông tin công ty',
                loadComponent: () => import('./pages/thong-tin-cong-ty/thong-tin-cong-ty').then(m => m.ThongTinCongTy),
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

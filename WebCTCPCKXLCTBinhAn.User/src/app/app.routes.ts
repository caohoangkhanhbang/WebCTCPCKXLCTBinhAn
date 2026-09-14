import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                title: 'Trang chủ',
                loadComponent: () => import('./pages/home/home').then(m => m.Home)
            },
            {
                path: 'gioi-thieu',
                title: 'Giới thiệu',
                loadComponent: () => import('./pages/gioi-thieu/gioi-thieu').then(m => m.GioiThieu)
            },
            {
                path: 'linh-vuc-hoat-dong',
                title: 'Lĩnh vực hoạt động',
                loadComponent: () => import('./pages/linh-vuc-hoat-dong/linh-vuc-hoat-dong').then(m => m.LinhVucHoatDong)
            },
            {
                path: 'lien-he',
                title: 'Liên hệ',
                loadComponent: () => import('./pages/lien-he/lien-he').then(m => m.LienHe)
            },
            {
                path: 'tuyen-dung',
                title: 'Tuyển dụng',
                loadComponent: () => import('./pages/tuyen-dung/tuyen-dung').then(m => m.TuyenDung)
            },
            {
                path: 'du-an',
                children: [
                    {
                        path: '',
                        title: 'Dự án',
                        loadComponent: () => import('./pages/du-an/du-an').then(m => m.DuAn)
                    },
                    {
                        path: ':id',
                        title: 'Chi tiết dự án',
                        loadComponent: () => import('./pages/chi-tiet-du-an/chi-tiet-du-an').then(m => m.ChiTietDuAn)
                    }
                ]
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

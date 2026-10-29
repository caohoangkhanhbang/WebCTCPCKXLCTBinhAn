import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { RouterLink } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { CompanyInfo } from "../core/services/company-info";
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.development';


@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.css',
    standalone: true,
    imports: [RouterOutlet, RouterLink]
})
export class MainLayout {
    isOpenMenu = signal<boolean>(false);
    isOpenMenuProfile = signal<boolean>(false);
    authService = inject(AuthService);
    readonly cdnUrl = environment.cdnUrl;
    readonly staticUrl = environment.staticUrl;
    companyInfo = inject(CompanyInfo).thongTinCty;

    toggleMenu() {
        this.isOpenMenu.set(!this.isOpenMenu());
    }

    toggleMenuProfile() {
        this.isOpenMenuProfile.set(!this.isOpenMenuProfile());
    }

    logout() {
        this.authService.logout();
    }
}
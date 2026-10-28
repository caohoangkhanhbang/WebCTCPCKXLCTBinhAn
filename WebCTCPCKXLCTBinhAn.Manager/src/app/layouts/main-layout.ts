import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { RouterLink } from "@angular/router";
import { AuthService } from "../core/services/auth.service";

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
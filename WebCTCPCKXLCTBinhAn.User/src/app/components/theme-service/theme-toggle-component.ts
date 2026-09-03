import { Component, inject } from '@angular/core';
import { ThemeService } from './theme-service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    templateUrl: './theme-service.html',
    styleUrl: './theme-service.css',
})

export class ThemeToggleComponent {
    readonly themeService = inject(ThemeService);
}
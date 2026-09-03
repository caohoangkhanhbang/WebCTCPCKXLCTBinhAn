import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;

      const theme = this.currentTheme();
      const root = document.documentElement;

      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      localStorage.setItem('user-theme', theme);
    });
  }

  toggleTheme(): void {
    this.currentTheme.update(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) return 'light';
    const savedTheme = localStorage.getItem('user-theme') as Theme | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
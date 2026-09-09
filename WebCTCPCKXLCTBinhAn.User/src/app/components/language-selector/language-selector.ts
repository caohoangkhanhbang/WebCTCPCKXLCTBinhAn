import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css',
})
export class LanguageSelector implements OnInit {
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  private readonly STORAGE_KEY = 'app_lang';
  private readonly DEFAULT_LANG = 'vi';
  isDropdownOpen = signal<boolean>(false);

  languages = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'en', name: 'English' }
  ];

  selectedLang = signal<string>(this.DEFAULT_LANG);

  ngOnInit(): void {
    const savedLang = this.getSavedLanguage();

    this.selectedLang.set(savedLang);
    this.translate.setFallbackLang(this.DEFAULT_LANG);

    this.translate.use(savedLang).subscribe({
      next: () => this.cdr.markForCheck(),
      error: (err) => console.error('Lỗi load i18n ban đầu:', err)
    });
  }

  changeLanguage(langCode: string): void {
    this.selectedLang.set(langCode);
    this.toggleLanguageDropdown();
    this.translate.use(langCode).subscribe({
      next: () => {
        this.saveLanguage(langCode);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Lỗi chuyển ngôn ngữ:', err)
    });
  }

  toggleLanguageDropdown(): void {
    this.isDropdownOpen.update(prev => !prev);
  }

  private getSavedLanguage(): string {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const localLang = localStorage.getItem(this.STORAGE_KEY);
        if (localLang && this.languages.some(l => l.code === localLang)) {
          return localLang;
        }
      }
    } catch (e) {
      console.warn('Không thể truy cập localStorage:', e);
    }
    return this.DEFAULT_LANG;
  }

  private saveLanguage(langCode: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, langCode);
      }
    } catch (e) {
      console.error('Không thể lưu vào localStorage:', e);
    }
  }
}
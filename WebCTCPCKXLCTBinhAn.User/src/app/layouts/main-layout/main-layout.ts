import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LanguageSelector } from '../../components/language-selector/language-selector';
import { TranslatePipe } from '@ngx-translate/core';
import { MainLayoutServices } from './main-layout-services';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../enviroments/enviroment';
import { CompanyInfo } from '../../Services/company-info';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, RouterLink, LanguageSelector, TranslatePipe, FormsModule],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.css',
    standalone: true
})
export class MainLayout {
    private service = inject(MainLayoutServices);
    readonly cdnUrl = environment.cdnUrl;
    companyInfo = inject(CompanyInfo);
    thongTinCty = this.companyInfo.thongTinCty;
    giaiPhap = toSignal(this.service.getGiaiPhap(), { initialValue: [] as any[] });
    isOpenMenu = signal<boolean>(true);

    toogleMenu(): void {
        this.isOpenMenu.update(prev => !prev);
    }

    closeMenuOnSelect(event: MouseEvent) {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;
        const target = event.target as HTMLElement;
        if (target.tagName === 'A') {
            this.isOpenMenu.set(false);
        }
    }

    groupGiaiPhap = computed(() => {
        const item = this.giaiPhap();
        const chunkSize = 7;
        const result = [];
        for (let i = 0; i < item.length; i += chunkSize) {
            result.push(item.slice(i, i + chunkSize));
        }
        return result;
    })

    searchQuery = signal<string>('');
    router = inject(Router);

    onSearch() {
        const query = this.searchQuery().trim();
        if (query) {
            this.router.navigate(["/du-an"], { queryParams: { query } })
        }
        this.searchQuery.set('');
    }
}
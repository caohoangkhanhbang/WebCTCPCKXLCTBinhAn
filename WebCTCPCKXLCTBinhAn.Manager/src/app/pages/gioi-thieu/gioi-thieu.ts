import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { GioiThieuService } from './gioi-thieu-service';
import { Dialog } from './dialog/dialog';

@Component({
  selector: 'app-gioi-thieu',
  standalone: true,
  imports: [Dialog],
  templateUrl: './gioi-thieu.html',
  styleUrl: './gioi-thieu.css',
  providers: [GioiThieuService]
})
export class GioiThieu {

  private readonly service = inject(GioiThieuService);
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly searchTerm = signal('');

  private readonly query = computed(() => ({
    page: this.currentPage(),
    pageSize: this.pageSize(),
    search: this.searchTerm()
  }));

  readonly data = toSignal(
    toObservable(this.query).pipe(
      switchMap(query => {
        return this.service.list(
          query.page,
          query.pageSize,
          query.search
        );
      })),
    {
      initialValue: null
    }
  );


  readonly totalPages = computed(() => {

    return this.data()?.totalPages ?? 1;

  });

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const pageSize = Number(select.value);
    if (!Number.isFinite(pageSize) || pageSize <= 0) {
      return;
    }

    this.pageSize.set(pageSize);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
  }

  goToFirstPage(): void {
    if (this.currentPage() === 1) {
      return;
    }
    this.currentPage.set(1);
  }

  goToPreviousPage(): void {
    if (this.currentPage() <= 1) {
      return;
    }
    this.currentPage.update(page => page - 1);
  }

  goToNextPage(): void {
    if (this.currentPage() >= this.totalPages()) {
      return;
    }
    this.currentPage.update(page => page + 1);
  }

  goToLastPage(): void {
    const lastPage = this.totalPages();
    if (this.currentPage() === lastPage) {
      return;
    }
    this.currentPage.set(lastPage);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.trim());
    this.currentPage.set(1);
  }

  isOpen = signal(false);
  selectedId = signal<number | null>(null);
  mode = signal<'create' | 'view' | 'edit'>('create');


  onView(id: number): void {
    this.selectedId.set(id);
    this.mode.set('view');
    this.isOpen.set(true);
  }

  onEdit(id: number | null): void {
    this.selectedId.set(id);
    this.mode.set('edit');
    this.isOpen.set(true);
  }

  onDelete(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        console.log(`Item with ID ${id} deleted successfully.`);
        // Refresh the data after deletion
        this.currentPage.set(this.currentPage());
      },
      error: err => {
        console.error(`Error deleting item with ID ${id}:`, err);
      }
    });
  }

}

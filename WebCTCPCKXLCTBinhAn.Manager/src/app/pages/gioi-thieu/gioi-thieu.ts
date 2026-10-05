import { Component, computed, inject, signal } from '@angular/core';
import { GioiThieuEdit } from './dialog/gioi-thieu-edit';
import { GioiThieuService } from './gioi-thieu-service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';
import { distinctUntilChanged, switchMap, debounceTime } from 'rxjs';
import { AnnouncementService } from '../../components/dialog/announcement-service';

@Component({
  selector: 'app-gioi-thieu',
  imports: [GioiThieuEdit],
  standalone: true,
  templateUrl: './gioi-thieu.html',
  providers: [GioiThieuService]
})
export class GioiThieu {
  service = inject(GioiThieuService);
  isOpen = signal<boolean>(false);
  selectedId = signal<number | null>(null);
  hanhDong = signal<'create' | 'view' | 'update'>('create');
  cdnUrl = environment.cdnUrl;
  page = signal<number>(1);
  pageSize = signal<number>(10);
  search = signal<string>('');
  totalPages = computed(() => this.data()?.TotalPages ?? 1);
  launch = computed(() => ({
    page: this.page(),
    pageSize: this.pageSize(),
    search: this.search(),
    reload: this.reload()
  }));
  reload = signal<number>(0);
  thongbao = inject(AnnouncementService);

  onSearch(e: Event) {
    const keyword = (e.target as HTMLInputElement).value;
    this.search.set(keyword);
  }
  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.page.set(1);
  }
  goToFirstPage() {
    if (this.page() === 1) return;
    this.page.set(1);
  }
  goToPreviousPage() {
    if (this.page() <= 1) return;
    this.page.update((value) => value - 1);
  }
  goToNextPage() {
    if (this.page() >= this.totalPages()) return;
    this.page.update(value => value + 1);
  }
  goToLastPage() {
    if (this.page() === this.totalPages()) return;
    this.page.set(this.totalPages());
  }

  reloadData() {
    this.reload.update(cong => cong + 1);
    this.page.set(1);
  }

  columns = [{ name: 'STT' }, { name: 'Thời gian' }, { name: 'Nội dung' }, { name: 'Hiển thị' }, { name: 'Hành động' }];

  data = toSignal<any>(
    toObservable(this.launch).pipe(
      debounceTime(300),
      distinctUntilChanged((truoc, sau) => truoc.page === sau.page && truoc.pageSize === sau.pageSize && truoc.search === sau.search && truoc.reload === sau.reload),
      switchMap(query =>
        this.service.getList(query.page, query.pageSize, query.search)
      )
    )
    , { initialValue: null });

  async onDelete(id: number, name: string) {
    const result = await this.thongbao.hienThi(`"${name}" sẽ bị xóa vĩnh viễn`, 'Thông báo ✌️', [{ label: 'Xóa', value: 'dongy', style: 'maula' }]);
    if (result !== 'dongy') return;
    this.service.delete(id).subscribe({
      next: () => {
        this.thongbao.hienThi(`Xóa thành công!`);
        this.reloadData();
      },
      error: (err) => {
        console.error(err);
        this.thongbao.hienThi(`Xóa thất bại vui lòng liên hệ lập trình viên!!!`);
      }
    });
  }

  onEdit(id: number) {
    this.hanhDong.set('update');
    this.selectedId.set(id);
    this.isOpen.set(true);
  }

  onView(id: number) {
    this.hanhDong.set('view');
    this.selectedId.set(id);
    this.isOpen.set(true);
  }

  onCreate() {
    this.isOpen.set(true);
    this.selectedId.set(null);
    this.hanhDong.set('create');
  }
}

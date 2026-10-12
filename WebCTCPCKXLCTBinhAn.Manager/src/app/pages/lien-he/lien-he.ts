import { Component, computed, inject, signal } from '@angular/core';
import { LienHeService } from './lien-he-service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';
import { distinctUntilChanged, switchMap, debounceTime } from 'rxjs';
import { AnnouncementService } from '../../components/dialog/announcement-service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-lien-he',
  imports: [DatePipe],
  standalone: true,
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.css',
  providers: [LienHeService]
})
export class LienHe {
  service = inject(LienHeService);
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

  columns = [{ name: 'STT' }, { name: 'Họ và tên' }, { name: 'Nội dung trao đổi' }, { name: 'Email' }, { name: 'Số điện thoại' }, { name: 'Căn cước công dân' }, { name: 'Ngày liên hệ' }, { name: 'Đã xem' }, { name: 'Hành động' }];

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

  onEdit(id: number, data: any) {
    this.service.update(id, data).subscribe({
      next: () => {
        this.thongbao.hienThi(`Cập nhật thành công!`);
      }
      ,
      error: (err) => {
        console.error(err);
        this.thongbao.hienThi(`Cập nhật thất bại vui lòng liên hệ lập trình viên!!!`);
      }
    });
    this.reload.update(cong => cong + 1);
  }
}

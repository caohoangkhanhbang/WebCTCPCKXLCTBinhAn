import { Component, inject, signal } from '@angular/core';
import { LinhVucHoatDongEdit } from './linh-vuc-hoat-dong-edit/linh-vuc-hoat-dong-edit';
import { LinhVucHoatDongService } from './linh-vuc-hoat-dong-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-linh-vuc-hoat-dong',
  imports: [LinhVucHoatDongEdit],
  templateUrl: './linh-vuc-hoat-dong.html',
  styleUrl: './linh-vuc-hoat-dong.css',
  providers: [LinhVucHoatDongService]
})
export class LinhVucHoatDong {
  service = inject(LinhVucHoatDongService);
  isOpen = signal<boolean>(false);
  selectedId = signal<number | null>(null);
  hanhDong = signal<'create' | 'view' | 'update'>('create');
  cdnUrl = environment.cdnUrl;
  page = signal<number>(1);
  pageSize = signal<number>(10);
  search = signal<string>('');

  data = toSignal<any>(this.service.getList(this.page(), this.pageSize(), this.search()), {});

  columns = [{ name: 'STT' }, { name: 'Tên lĩnh vực hoạt động' }, { name: 'Nội dung' }, { name: 'Hình ảnh' }, { name: 'Hiển thị' }, { name: 'Hành động' }];
  onSearch(e: Event) { }
  onDelete(id: number, name: string) { }
  onEdit(id: number) { }
  onView(id: number) { }
  onCreate() { }
  onPageSizeChange(event: Event) { }
}

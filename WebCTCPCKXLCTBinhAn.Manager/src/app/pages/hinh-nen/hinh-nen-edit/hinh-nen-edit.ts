import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HinhNenService } from '../hinh-nen-service';
import { environment } from '../../../../environments/environment.development';
import { AnnouncementService } from '../../../components/dialog/announcement-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './hinh-nen-edit.html',
  styleUrl: './hinh-nen-edit.css',
  providers: [HinhNenService]
})
export class HinhNenEdit {
  hanhDong = input<'create' | 'view' | 'update'>('create');
  isOpen = model<boolean>(false);
  id = input<number | null>(null);
  id_loai_trang = input<number | null>(null);
  idLoaiTrangNew = signal<number | null>(null);
  fb = inject(FormBuilder);
  service = inject(HinhNenService);
  selectedFile: File | null = null;
  imageReview: string | null = null;
  cdnUrl = environment.cdnUrl;
  oldImage: string | null = null;
  finish = output<void>();
  thongbao = inject(AnnouncementService);
  private readonly maxFile = 4;
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  listSelectedFile: File[] = [];
  listImageReview: string[] = [];
  loaiTrangList = toSignal(this.service.getLoaiTrangList(), { initialValue: [] as any });

  constructor() {
    effect(() => {
      const id = this.id();
      const open = this.isOpen();

      if (!open) return;

      if (id === null) {
        this.resetData();
        return;
      }

      this.service.getById(id).subscribe({
        next: response => {
          this.formData.patchValue({
            hien_thi: response.hien_thi,
          })
          this.oldImage = response.hinh;
          this.idLoaiTrangNew.set(response.id_loai_trang);
        },
        error: error => {
          this.thongbao.hienThi('Có lỗi xảy ra khi lấy dữ liệu', 'Thông báo');
          console.error('Error fetching data:', error);
        }
      })
    });

    effect(() => {
      if (this.hanhDong() === 'view')
        this.formData.disable();
      else {
        this.formData.enable();
      }

    });
  }

  formData = this.fb.group({
    hien_thi: [true]
  });

  resetData() {
    this.formData.reset({
      hien_thi: true,
    })
    this.selectedFile = null;
    this.oldImage = null;
    if (this.imageReview) {
      URL.revokeObjectURL(this.imageReview);
      this.imageReview = null;
    }
    this.clearSelectedFiles();
    this.idLoaiTrangNew.set(null);
  }

  clearSelectedFiles() {
    for (const image of this.listImageReview) {
      URL.revokeObjectURL(image);
    }
    this.listSelectedFile = [];
    this.listImageReview = [];
  }

  ngOnDestroy() {
    this.clearSelectedFiles();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.thongbao.hienThi('Vui lòng chọn file hình ảnh hợp lệ', 'Thông báo');
        return;
      }
      this.selectedFile = file;
      if (this.imageReview) {
        URL.revokeObjectURL(this.imageReview);
      }
      this.imageReview = URL.createObjectURL(file);
    }
  }

  onLoaiTrangChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    this.idLoaiTrangNew.set(selectedValue ? Number(selectedValue) : null);
  }

  initialData(): FormData {
    const data = new FormData();
    data.append('id_loai_trang', String(this.idLoaiTrangNew()) ?? null);
    data.append('hien_thi', String(this.formData.get('hien_thi')?.value ?? 'false'));
    if (this.selectedFile) {
      data.append('file', this.selectedFile, this.selectedFile.name);
    }
    if (this.listSelectedFile) {
      for (const file of this.listSelectedFile) {
        data.append('file', file, file.name);
      }
    }
    return data;
  }

  async onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const data = this.initialData();

    if (this.hanhDong() === 'create') {
      this.service.insert(data).subscribe({
        next: response => {
          this.thongbao.hienThi('Thêm mới thành công', 'Thông báo');
          this.onClose();
        },
        error: error => {
          console.error('Error creating data:', error);
          this.thongbao.hienThi('Có lỗi xảy ra khi thêm mới dữ liệu', 'Thông báo');
        }
      });
    } else if (this.hanhDong() === 'update' && this.id() !== null && this.idLoaiTrangNew() !== null) {
      this.service.update(this.id()!, data).subscribe({
        next: response => {
          this.thongbao.hienThi('Cập nhật thành công', 'Thông báo');
          this.onClose();
        },
        error: error => {
          console.error('Error updating data:', error);
          this.thongbao.hienThi('Có lỗi xảy ra khi cập nhật dữ liệu', 'Thông báo');
        }
      });
    }
  }

  onClose() {
    this.resetData();
    this.isOpen.set(false);
    this.finish.emit();
  }

  onCreateFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;
    const remaining = this.maxFile - this.listSelectedFile.length;
    if (remaining <= 0) {
      this.thongbao.hienThi(`Bạn chỉ có thể chọn tối đa ${this.maxFile} file`, 'Thông báo');
      input.value = '';
      return;
    }
    const candidates = files.slice(0, remaining);
    const validFiles: File[] = [];
    for (const file of candidates) {
      if (!file.type.startsWith('image/')) {
        this.thongbao.hienThi('Vui lòng chọn file hình ảnh hợp lệ', 'Thông báo');
        continue;
      }
      if (file.size > this.maxFileSize) {
        this.thongbao.hienThi(`File ${file.name} vượt quá kích thước tối đa ${this.maxFileSize / (1024 * 1024)}MB`, 'Thông báo');
        continue;
      }
      validFiles.push(file);
    }

    for (const file of validFiles) {
      const imageUrl = URL.createObjectURL(file);
      this.listImageReview.push(imageUrl);
      this.listSelectedFile.push(file);
    }
    if (files.length > remaining) {
      this.thongbao.hienThi(`Bạn chỉ có thể chọn tối đa ${remaining} file`, 'Thông báo');
    }
    input.value = '';
  }

  removeImage(index: number) {
    const image = this.listImageReview[index];
    if (!image) return;
    URL.revokeObjectURL(image);
    this.listImageReview.splice(index, 1);
    this.listSelectedFile.splice(index, 1);
  }
}

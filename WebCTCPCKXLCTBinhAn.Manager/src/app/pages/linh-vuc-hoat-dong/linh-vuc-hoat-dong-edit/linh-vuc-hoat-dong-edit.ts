import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinhVucHoatDongService } from '../linh-vuc-hoat-dong-service';
import { environment } from '../../../../environments/environment.development';


@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './linh-vuc-hoat-dong-edit.html',
  styleUrl: './linh-vuc-hoat-dong-edit.css',
  providers: [LinhVucHoatDongService]
})
export class LinhVucHoatDongEdit {
  hanhDong = input<'create' | 'view' | 'update'>('create');
  isOpen = model<boolean>(false);
  id = input<number | null>(null);
  fb = inject(FormBuilder);
  service = inject(LinhVucHoatDongService);
  selectedFile: File | null = null;
  imageReview: string | null = null;
  cdnUrl = environment.cdnUrl;
  oldImage: string | null = null;
  finish = output<void>();

  constructor() {
    effect(() => {
      const id = this.id();
      if (id === null) {
        this.resetData();
        return;
      }

      this.service.getById(this.id()).subscribe({
        next: response => {
          this.formData.patchValue(
            {
              giai_phap: response.giai_phap,
              noi_dung: response.noi_dung,
              hien_thi: response.hien_thi
            }
          )
          this.oldImage = response.hinh;
        },
        error: error => confirm(error)
      })
    });
  }

  formData = this.fb.group({
    giai_phap: ['', [Validators.required]],
    noi_dung: ['', [Validators.required]],
    hien_thi: [true]
  });

  resetData() {
    this.formData.reset({
      giai_phap: '',
      noi_dung: '',
      hien_thi: true
    })
    this.oldImage = null;
    this.imageReview = null;
    this.finish.emit();
    this.isOpen.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
      this.selectedFile = file;
      if (this.imageReview) {
        URL.revokeObjectURL(this.imageReview);
      }
      this.imageReview = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const data = new FormData();
    data.append('giai_phap', this.formData.get('giai_phap')?.value ?? '');
    data.append('noi_dung', this.formData.get('noi_dung')?.value ?? '');
    if (this.selectedFile) {
      data.append('file', this.selectedFile, this.selectedFile.name);
    }
    data.append('hien_thi', String(this.formData.get('hien_thi')?.value ?? 'false'));

    if (this.hanhDong() === 'create') {
      this.service.insert(data).subscribe({
        next: response => {
          alert('Thêm mới thành công');
          this.resetData();
        },
        error: error => {
          console.error('Error creating data:', error);
          alert('Có lỗi xảy ra khi thêm mới dữ liệu');
        }
      });
    } else if (this.hanhDong() === 'update' && this.id() !== null) {
      this.service.update(this.id()!, data).subscribe({
        next: response => {
          alert('Cập nhật thành công');
          this.resetData();
        },
        error: error => {
          console.error('Error updating data:', error);
          alert('Có lỗi xảy ra khi cập nhật dữ liệu');
        }
      });
    }
  }

  onClose() {
    this.isOpen.set(false);
    this.resetData();
    if (this.imageReview) {
      URL.revokeObjectURL(this.imageReview);
      this.imageReview = null;
    }
  }
}

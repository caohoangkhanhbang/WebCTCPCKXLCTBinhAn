import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuyenDungService } from '../tuyen-dung-service';
import { environment } from '../../../../environments/environment.development';
import { AnnouncementService } from '../../../components/dialog/announcement-service';

import { ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor';


@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule, RichTextEditorComponent],
  templateUrl: './tuyen-dung-edit.html',
  providers: [TuyenDungService]
})
export class TuyenDungEdit {
  hanhDong = input<'create' | 'view' | 'update'>('create');
  isOpen = model<boolean>(false);
  id = input<number | null>(null);
  fb = inject(FormBuilder);
  service = inject(TuyenDungService);
  selectedFile: File | null = null;
  imageReview: string | null = null;
  cdnUrl = environment.cdnUrl;
  oldImage: string | null = null;
  finish = output<void>();
  thongbao = inject(AnnouncementService);

  @ViewChild(RichTextEditorComponent) richTextEditor!: RichTextEditorComponent;

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
          this.formData.patchValue(
            {
              ten_cong_viec: response.ten_cong_viec,
              mo_ta: response.mo_ta,
              noi_dung: response.noi_dung,
              dia_diem: response.dia_diem,
              ngay_bd_tuyen: response.ngay_bd_tuyen,
              ngay_kt_tuyen: response.ngay_kt_tuyen,
              luong: response.luong,
              hien_thi: response.hien_thi,
            }
          )
          this.oldImage = response.hinh ?? null;
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
      else
        this.formData.enable();
    })
  }

  formData = this.fb.group({
    ten_cong_viec: ['', [Validators.required]],
    mo_ta: ['', [Validators.required]],
    noi_dung: ['', [Validators.required]],
    dia_diem: ['', [Validators.required]],
    ngay_bd_tuyen: [new Date().toISOString().split('T')[0], [Validators.required]],
    ngay_kt_tuyen: ['', [Validators.required]],
    luong: ['', [Validators.required]],
    hien_thi: [true]
  });

  resetData() {
    this.formData.reset({
      ten_cong_viec: '',
      mo_ta: '',
      noi_dung: '',
      dia_diem: '',
      ngay_bd_tuyen: '',
      ngay_kt_tuyen: '',
      luong: '',
      hien_thi: true
    })
    this.selectedFile = null;
    this.oldImage = null;
    if (this.imageReview) {
      URL.revokeObjectURL(this.imageReview);
      this.imageReview = null;
    }
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

  async onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const noiDung = await this.richTextEditor.prepareContentForSave();

    const data = new FormData();
    data.append('ten_cong_viec', this.formData.get('ten_cong_viec')?.value ?? '');
    data.append('mo_ta', this.formData.get('mo_ta')?.value ?? '');
    data.append('noi_dung', noiDung.toString() ?? '');
    data.append('hien_thi', String(this.formData.get('hien_thi')?.value ?? 'false'));
    data.append('dia_diem', this.formData.get('dia_diem')?.value ?? '');
    data.append('ngay_bd_tuyen', this.formData.get('ngay_bd_tuyen')?.value ?? '');
    data.append('ngay_kt_tuyen', this.formData.get('ngay_kt_tuyen')?.value ?? '');
    data.append('luong', this.formData.get('luong')?.value ?? '');
    data.append('hien_thi', String(this.formData.get('hien_thi')?.value ?? 'false'));

    if (this.selectedFile) {
      data.append('file', this.selectedFile, this.selectedFile.name);
    }

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
    } else if (this.hanhDong() === 'update' && this.id() !== null) {
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
}

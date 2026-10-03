import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DuAnService } from '../du-an-service';
import { environment } from '../../../../environments/environment.development';
import { AnnouncementService } from '../../../components/dialog/announcement-service';

import { ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor';


@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule, RichTextEditorComponent],
  templateUrl: './du-an-edit.html',
  providers: [DuAnService]
})
export class DuAnEdit {
  hanhDong = input<'create' | 'view' | 'update'>('create');
  isOpen = model<boolean>(false);
  id = input<number | null>(null);
  fb = inject(FormBuilder);
  service = inject(DuAnService);
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
              ten_du_an: response.ten_du_an,
              bo_nghia: response.bo_nghia,
              noi_dung: response.noi_dung,
              hien_thi: response.hien_thi,
              hang_muc_thi_cong: response.hang_muc_thi_cong,
              chu_dau_tu: response.chu_dau_tu,
              thoi_gian: response.thoi_gian
            }
          )
          this.oldImage = response.hinh;
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
    ten_du_an: ['', [Validators.required]],
    bo_nghia: ['', [Validators.required]],
    noi_dung: ['', [Validators.required]],
    hien_thi: [true],
    hang_muc_thi_cong: ['', [Validators.required]],
    chu_dau_tu: ['', [Validators.required]],
    thoi_gian: [new Date().toISOString().split('T')[0], [Validators.required]],
  });

  resetData() {
    this.formData.reset({
      ten_du_an: '',
      bo_nghia: '',
      noi_dung: '',
      hien_thi: true,
      hang_muc_thi_cong: '',
      chu_dau_tu: '',
      thoi_gian: new Date().toISOString().split('T')[0]
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
    data.append('ten_du_an', this.formData.get('ten_du_an')?.value ?? '');
    data.append('bo_nghia', this.formData.get('bo_nghia')?.value ?? '');
    data.append('noi_dung', noiDung.toString() ?? '');
    data.append('hien_thi', String(this.formData.get('hien_thi')?.value ?? 'false'));
    data.append('hang_muc_thi_cong', this.formData.get('hang_muc_thi_cong')?.value ?? '');
    data.append('chu_dau_tu', this.formData.get('chu_dau_tu')?.value ?? '');
    data.append('thoi_gian', this.formData.get('thoi_gian')?.value ?? '');
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

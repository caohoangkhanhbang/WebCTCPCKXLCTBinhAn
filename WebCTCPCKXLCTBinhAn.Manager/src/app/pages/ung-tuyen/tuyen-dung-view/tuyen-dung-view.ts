import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UngTuyenService } from '../ung-tuyen-service';
import { environment } from '../../../../environments/environment.development';
import { AnnouncementService } from '../../../components/dialog/announcement-service';
import { ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor';

@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule, RichTextEditorComponent],
  templateUrl: './tuyen-dung-view.html',
  providers: [UngTuyenService]
})
export class UngTuyenEdit {
  hanhDong = input<'create' | 'view' | 'update'>('create');
  isOpen = model<boolean>(false);
  id = input<number | null>(null);
  fb = inject(FormBuilder);
  service = inject(UngTuyenService);
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
    this.oldImage = null;
  }

  onClose() {
    this.resetData();
    this.isOpen.set(false);
    this.finish.emit();
  }
}

import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GioiThieuService } from '../gioi-thieu-service';
import { environment } from '../../../../environments/environment.development';
import { AnnouncementService } from '../../../components/dialog/announcement-service';
import { ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor';


@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule, RichTextEditorComponent],
  templateUrl: './gioi-thieu-edit.html',
  providers: [GioiThieuService]
})
export class GioiThieuEdit {
  hanhDong = input<'create' | 'view' | 'update'>('create');
  isOpen = model<boolean>(false);
  id = input<number | null>(null);
  fb = inject(FormBuilder);
  service = inject(GioiThieuService);
  cdnUrl = environment.cdnUrl;
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
          this.formData.patchValue({
            noi_dung: response.noi_dung,
            thoi_gian: response.thoi_gian,
            hien_thi: response.hien_thi
          });
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
    noi_dung: ['', [Validators.required]],
    thoi_gian: ['', [Validators.required]],
    hien_thi: [true]
  });

  resetData() {
    this.formData.reset({
      noi_dung: '',
      thoi_gian: '',
      hien_thi: true
    });   
  }

  async onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const noiDung = await this.richTextEditor.prepareContentForSave();

    const data = new FormData();
    data.append('noi_dung', noiDung.toString() ?? '');
    data.append('thoi_gian', this.formData.get('thoi_gian')?.value ?? '');
    data.append('hien_thi', String(this.formData.get('hien_thi')?.value ?? 'false'));

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

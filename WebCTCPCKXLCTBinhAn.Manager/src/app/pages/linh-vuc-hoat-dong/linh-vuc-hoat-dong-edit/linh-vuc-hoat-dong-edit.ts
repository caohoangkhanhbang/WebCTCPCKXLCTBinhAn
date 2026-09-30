import { Component, inject, input, model } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './linh-vuc-hoat-dong-edit.html',
  styleUrl: './linh-vuc-hoat-dong-edit.css',
})
export class LinhVucHoatDongEdit {
  hanhDong = input<'create'|'view'|'update'>('create');
  isOpen = model<boolean>(false);
  id = input<number|null>(null);
  fb = inject(FormBuilder);
  formData = this.fb.group({});

  onSubmit(){}
  onClose() {
    this.isOpen.set(false);
  }
}

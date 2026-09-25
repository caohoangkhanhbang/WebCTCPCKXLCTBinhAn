import { Component, effect, inject, input, model } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GioiThieuService } from '../gioi-thieu-service';

@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
  standalone: true
})
export class Dialog {
  fb = inject(FormBuilder);
  isOpen = model<boolean>(false);
  selectedId = input<number | null>(null);
  service = inject(GioiThieuService);
  isEdit = false;

  formData = this.fb.group({
    noi_dung: ['', [Validators.required]],
    thoi_gian: ['', [Validators.required]],
    is_delete: [false],
    hien_thi: [true]
  });

  mode = model<'create' | 'view' | 'edit'>('create');

  resetForm() {
    this.formData.reset(
      {
        noi_dung: '',
        thoi_gian: '',
        is_delete: false,
        hien_thi: true
      }
    );
  }

  constructor() {
    effect(() => {
      const id = this.selectedId();
      if (id === null) {
        this.formData.enable();
        this.mode.set('create');
        this.resetForm();
        return;
      }
      // this.isEdit = true;
      this.loadData(id);
    });
  }

  loadData(id: number): void {
    this.service.getById(id).subscribe({
      next: data => {
        this.formData.patchValue({
          noi_dung: data.noi_dung,
          thoi_gian: data.thoi_gian,
          is_delete: data.is_delete,
          hien_thi: data.hien_thi
        });
        if (this.mode() === 'view') {
          this.formData.disable();
          return;
        }
        this.formData.enable();
      },
      error: err => {
        console.error('Error loading data:', err);
      }
    });
  }

  onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }
    const data = this.formData.getRawValue();
    console.log('Form submitted:', this.mode());
    if (this.mode() === 'create') {
      this.service.insert(data).subscribe({
        next: response => {
          console.log('mode:', this.mode());
          this.isOpen.set(false);
          this.resetForm();
        },
        error: err => {
          console.error('Error inserting data:', err);
        }
      });
    } else {
      const id = this.selectedId();
      if (id === null) {
        console.error('No ID provided for update.');
        return;
      }
      this.service.update(id, data).subscribe({
        next: response => {
          console.log('mode:', this.mode());
          this.isOpen.set(false);
          this.resetForm();
        },
        error: err => {
          console.error('Error updating data:', err);
        }
      });
    }
  }

  onClose() {
    this.isOpen.set(false);
  }
}

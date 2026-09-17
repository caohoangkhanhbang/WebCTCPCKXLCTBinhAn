import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { DialogButton } from '../../components/confirm-dialog/confirm-dialog-model';
import { TuyenDungServices } from './tuyen-dung-services';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../enviroments/enviroment';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-tuyen-dung',
  imports: [TranslatePipe, ReactiveFormsModule, ConfirmDialog, DatePipe],
  templateUrl: './tuyen-dung.html',
  styleUrl: './tuyen-dung.css',
  providers: [TuyenDungServices]
})
export class TuyenDung {
  chooseFile = signal<boolean>(false);
  idCongViec = signal<number>(0);
  selectedFile: File | null = null;
  services = inject(TuyenDungServices);
  fb = inject(FormBuilder);
  data = this.fb.group({
    ten: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    sdt: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  })
  cdnUrl = environment.cdnUrl;

  tinTuyenDung = toSignal(this.services.GetTuyenDung(), { initialValue: [] });

  UngTuyen(id: number) {
    this.idCongViec.set(id);
    this.chooseFile.set(true);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0)
      this.selectedFile = input.files[0];
  }

  showDialog = signal<boolean>(false);
  message = 'CAREERS.CV_FILE';
  buttomsInfo: DialogButton[] = [
    { label: 'CONTACT.CONFIRM', value: 'confirm', style: 'primary' }
  ];

  onSubmit() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      return;
    }
    if (!this.selectedFile) {
      this.showDialog.set(true);
      return;
    }

    const formData = new FormData();
    formData.append('id_tuyen_dung', this.idCongViec().toString());
    formData.append('ten', this.data.get('ten')?.value || "");
    formData.append('email', this.data.get('email')?.value || "");
    formData.append('sdt', this.data.get('sdt')?.value || "");
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.services.submitUngTuyen(formData).subscribe({
      next: () => {
        this.message = 'CAREERS.SUCCESS';
        this.buttomsInfo = [
          { label: 'CONTACT.CLOSE', value: 'close', style: 'danger' }
        ]
        this.showDialog.set(true);
        this.data.reset();
        this.chooseFile.set(false);
        this.selectedFile = null;
      },
      error: (err) => { console.error(err) },
    })
  }

  handleDialogAction(action: string) {
    this.showDialog.set(false);
  }
}

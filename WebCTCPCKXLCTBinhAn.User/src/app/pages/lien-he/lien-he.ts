import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LienHeServices } from './lien-he-services';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { DialogButton } from '../../components/confirm-dialog/confirm-dialog-model';
import { environment } from '../../../enviroments/enviroment';
import { MahaHinhNen } from '../../Services/maha-hinh-nen';

@Component({
  selector: 'app-lien-he',
  imports: [TranslatePipe, ReactiveFormsModule, ConfirmDialog],
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.css',
  providers: [LienHeServices, MahaHinhNen]
})
export class LienHe {
  services = inject(LienHeServices);
  fb = inject(FormBuilder);
  data = this.fb.group({
    ten: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    sdt: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    cccd: [''],
    noi_dung: ['', [Validators.required]]
  })

  showDialog = signal<boolean>(false);
  message = 'CONTACT.SUBMITED_SUCCESSFULLY';
  buttomsInfo: DialogButton[] = [
    { label: 'CONTACT.CONFIRM', value: 'confirm', style: 'primary' }
  ];

  onSubmit() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      return;
    }
    this.services.submitLienHe(this.data.value).subscribe({
      next: () => {
        this.showDialog.set(true);
        this.clearForm();
      },
      error: (err) => { console.error(err) },
    })
  }

  clearForm() {
    this.data.reset();
  }

  handleDialogAction(action: string) {
    this.showDialog.set(false);
  }

  hinhNenInfo = inject(MahaHinhNen).hinhNen;
  backgroundPath = computed(() =>
    this.hinhNenInfo().filter((item: any) => item.ten_trang.trim().toLowerCase() === 'liên hệ').slice(-1)
  );
  CombineUrl(path: string): string {
    return `${environment.cdnUrl}/` + path;
  }
}


import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LienHeServices } from './lien-he-services';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { DialogButton } from '../../components/confirm-dialog/confirm-dialog-model';

@Component({
  selector: 'app-lien-he',
  imports: [TranslatePipe, ReactiveFormsModule, ConfirmDialog],
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.css',
  providers: [LienHeServices]
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
    console.log('Dialog action:', action);
  }
}


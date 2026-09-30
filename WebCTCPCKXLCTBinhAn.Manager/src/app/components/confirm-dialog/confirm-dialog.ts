import { Component, input, output } from '@angular/core';
import { DialogButton } from './confirm-dialog-model';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.css',
    standalone: true,
    imports: []
})

export class ConfirmDialog {
    message = input.required<string>();
    buttons = input<DialogButton[]>([
        { label: 'Xác nhận', value: 'confirm', style: 'primary' }
    ]);

    action = output<string>();

    onButtonClick(value: string) {
        this.action.emit(value);
    }

    onOverlayClick() {
        this.action.emit('dismiss');
    }
}
import { Component, input, output } from '@angular/core';
import { ButtonInfo } from '../announcement-model';

@Component({
    selector: 'kb-dialog',
    templateUrl: './kbdialog.html',
    styleUrl: './kbdialog.css',
    standalone: true,
    imports: []
})

export class KBDialog {
    title = input<string>();
    message = input.required<string>();
    buttons = input<ButtonInfo[]>([]);
    action = output<string>();

    onButtonClick(value: string) {
        this.action.emit(value);
    }

    onOverlayClick() {
        this.action.emit('dismiss');
    }
}
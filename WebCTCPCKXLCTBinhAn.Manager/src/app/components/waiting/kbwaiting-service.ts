import { Injectable, signal } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class KBWaitingService {
    isOpen = signal<boolean>(false);
    Mo() {
        this.isOpen.set(true);
    }
    Tat() {
        this.isOpen.set(false);
    }
}
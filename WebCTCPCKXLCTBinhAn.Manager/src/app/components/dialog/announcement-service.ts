import { Injectable, signal } from "@angular/core";
import { ButtonInfo } from "./announcement-model";
@Injectable({
    providedIn: 'root'
})

export class AnnouncementService {
    isOpen = signal<boolean>(false);
    title = signal<string>('Thông báo');
    message = signal<string>('');
    private readonly defaultButton: ButtonInfo[] = [{ label: 'Đóng', value: 'exit', style: 'maudo' }];
    buttons = signal<ButtonInfo[]>(this.defaultButton);

    private resolver?: (value: string) => void;

    hienThi(message: string, title: string = 'Thông báo', buttons: ButtonInfo[] = []): Promise<string> {
        this.title.set(title);
        this.message.set(message);
        this.buttons.set(buttons?.length > 0 ? [...this.defaultButton, ...buttons] : [...this.defaultButton]);
        this.isOpen.set(true);
        return new Promise(resolve => this.resolver = resolve)
    }

    close(value: string) {
        this.isOpen.set(false);
        this.resolver?.(value);
        this.resolver = undefined;
    }
}
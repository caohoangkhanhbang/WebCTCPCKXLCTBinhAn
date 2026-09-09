import { Directive, ElementRef, EventEmitter, HostListener, inject, Output, output } from "@angular/core";

@Directive({
    selector: '[appClickOutside]',
    standalone: true
})

export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>();
    private elementRef = inject(ElementRef);

    @HostListener('document:click', ['$event.target'])


    onClick(targetElement: EventTarget | null): void {
        if (!targetElement) return;
        // const isClickedInside = this.elementRef.nativeElement.contains(targetElement as Node);
        // if (!isClickedInside) {
        //     this.clickOutside.emit();
        // }
        // Dùng setTimeout 0ms để đẩy việc kiểm tra ra sau khi Angular đã cập nhật DOM xong
        setTimeout(() => {
            const isClickedInside = this.elementRef.nativeElement.contains(targetElement as Node);

            if (!isClickedInside) {
                this.clickOutside.emit();
            }
        }, 0);
    }
}
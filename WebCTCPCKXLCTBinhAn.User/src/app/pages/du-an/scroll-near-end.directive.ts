import { Directive, ElementRef, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
@Directive({
    selector: '[appScrollNearEnd]',
    standalone: true
})

export class ScrollNearEndDirective implements OnInit, OnDestroy {
    @Output() nearEnd = new EventEmitter<void>();

    private el = inject(ElementRef);
    private observer!: IntersectionObserver;

    ngOnInit(): void {
        this.observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.nearEnd.emit();
            }
        }, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        });
        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
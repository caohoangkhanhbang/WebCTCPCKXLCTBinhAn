import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
interface PendingImage {
    id: string;
    file: File;
    blobUrl: string;
}
@Component({
    selector: 'app-rich-text-editor',
    standalone: true,
    templateUrl: './rich-text-editor.html',
    styleUrl: './rich-text-editor.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(
                () => RichTextEditorComponent
            ),
            multi: true
        }
    ]
})
export class RichTextEditorComponent
    implements ControlValueAccessor, AfterViewInit, OnDestroy {
    private http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl + '/RichTextEditor';
    @ViewChild('editor')
    editor!: ElementRef<HTMLDivElement>;
    @ViewChild('imageInput')
    imageInput!: ElementRef<HTMLInputElement>;
    private disabled = false;
    private pendingValue: string | null = null;
    private savedRange: Range | null = null;
    private pendingImages = new Map<string, PendingImage>();
    private selectedImage: HTMLImageElement | null = null;
    private onChangeCallback: (value: string) => void = () => { };
    private onTouchedCallback: () => void = () => { };

    ngAfterViewInit(): void {
        if (this.pendingValue !== null) {
            this.editor.nativeElement.innerHTML =
                this.pendingValue;
            this.pendingValue = null;
        }
        this.setupImageSelection();
    }

    ngOnDestroy(): void {
        for (
            const image
            of this.pendingImages.values()
        ) {
            URL.revokeObjectURL(
                image.blobUrl
            );
        }
        this.pendingImages.clear();
    }

    exec(command: string): void {
        if (this.disabled) {
            return;
        }
        this.focusEditor();
        document.execCommand(
            command,
            false
        );
        this.updateValue();
    }

    formatBlock(event: Event): void {
        if (this.disabled) {
            return;
        }
        const select =
            event.target as HTMLSelectElement;

        if (!select.value) {
            return;
        }
        this.restoreSelection();
        document.execCommand(
            'formatBlock',
            false,
            select.value
        );
        this.updateValue();
        select.value = '';
    }

    fontSize(event: Event): void {
        if (this.disabled) {
            return;
        }
        const select =
            event.target as HTMLSelectElement;
        if (!select.value) {
            return;
        }
        this.restoreSelection();
        document.execCommand(
            'fontSize',
            false,
            select.value
        );
        this.updateValue();
        select.value = '';
    }

    foreColor(color: string): void {
        if (this.disabled) {
            return;
        }
        this.focusEditor();
        document.execCommand(
            'foreColor',
            false,
            color
        );
        this.updateValue();
    }

    alignLeft(): void {
        this.exec('justifyLeft');
    }

    alignCenter(): void {
        this.exec('justifyCenter');
    }

    alignRight(): void {
        this.exec('justifyRight');
    }

    alignJustify(): void {
        this.exec('justifyFull');
    }

    insertLink(): void {
        if (this.disabled) {
            return;
        }
        this.saveSelection();
        const url =
            window.prompt(
                'Nhập URL:',
                'https://'
            );
        if (!url) {
            return;
        }
        this.restoreSelection();
        document.execCommand(
            'createLink',
            false,
            url
        );
        this.updateValue();
    }

    removeLink(): void {
        this.exec('unlink');
    }

    selectImage(): void {
        if (this.disabled) {
            return;
        }
        this.saveSelection();
        this.imageInput.nativeElement.click();
    }

    async onImageSelected(
        event: Event
    ): Promise<void> {
        const input =
            event.target as HTMLInputElement;
        const files =
            Array.from(
                input.files ?? []
            );
        input.value = '';
        if (files.length === 0) {
            return;
        }
        for (const file of files) {
            await this.insertLocalImage(
                file
            );
        }
    }

    private async insertLocalImage(file: File): Promise<void> {
        if (!this.isValidImage(file)) { return; }
        const blobUrl = URL.createObjectURL(file);
        const id = crypto.randomUUID();
        this.pendingImages.set(id, { id, file, blobUrl });
        this.restoreSelection(); this.focusEditor();
        const html = ` <img src="${this.escapeAttribute(blobUrl)}" data-local-image-id="${id}" alt="" > `;
        document.execCommand('insertHTML', false, html); this.updateValue();
    }

    private isValidImage(file: File): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) { alert('Chỉ cho phép JPG, PNG, WEBP, GIF hoặc SVG.'); return false; }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) { alert('Ảnh không được lớn hơn 5MB.'); return false; } return true;
    }

    async onPaste(event: ClipboardEvent): Promise<void> {
        event.preventDefault(); const clipboard = event.clipboardData; if (!clipboard) { return; }
        const imageItem = Array.from(clipboard.items).find(item => item.type.startsWith('image/')); if (imageItem) { const file = imageItem.getAsFile(); if (file) { await this.insertLocalImage(file); return; } }
        const html = clipboard.getData('text/html'); if (html) { this.insertPastedHtml(html); return; }
        const text = clipboard.getData('text/plain'); if (text) { this.focusEditor(); document.execCommand('insertText', false, text); this.updateValue(); }
    }

    private insertPastedHtml(html: string): void { const cleanHtml = this.sanitizePastedHtml(html); this.focusEditor(); document.execCommand('insertHTML', false, cleanHtml); this.updateValue(); }

    private sanitizePastedHtml(html: string): string { const parser = new DOMParser(); const parsed = parser.parseFromString(html, 'text/html'); /* * Xóa tag nguy hiểm. */ const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select']; for (const tag of dangerousTags) { parsed.querySelectorAll(tag).forEach(element => element.remove()); } /* * Xóa onclick, onload, * onerror... */ parsed.querySelectorAll('*').forEach(element => { for (const attribute of Array.from(element.attributes)) { if (attribute.name.toLowerCase().startsWith('on')) { element.removeAttribute(attribute.name); } } }); return parsed.body.innerHTML; }

    onDragOver(event: DragEvent): void { event.preventDefault(); }

    async onDrop(event: DragEvent): Promise<void> { event.preventDefault(); if (this.disabled) { return; } const files = Array.from(event.dataTransfer?.files ?? []); if (files.length === 0) { return; } /* * Đặt caret tại vị trí drop. */ this.setCaretFromPoint(event.clientX, event.clientY); for (const file of files) { if (file.type.startsWith('image/')) { await this.insertLocalImage(file); } } }

    private setCaretFromPoint(x: number, y: number): void { const documentAny = document as any; let range: Range | null = null; if (documentAny.caretRangeFromPoint) { range = documentAny.caretRangeFromPoint(x, y); } else if (documentAny.caretPositionFromPoint) { const position = documentAny.caretPositionFromPoint(x, y); if (position) { range = document.createRange(); range.setStart(position.offsetNode, position.offset); range.collapse(true); } } if (!range) { return; } const selection = window.getSelection(); if (!selection) { return; } selection.removeAllRanges(); selection.addRange(range); this.savedRange = range.cloneRange(); }

    private saveSelection(): void {
        const selection = window.getSelection(); if (!selection || selection.rangeCount === 0) { return; } const range = selection.getRangeAt(0); if (!this.editor.nativeElement.contains(range.commonAncestorContainer)) { return; } this.savedRange = range.cloneRange();
    }

    private restoreSelection(): void {
        if (!this.savedRange) { return; } const selection = window.getSelection();
        if (!selection) { return; } selection.removeAllRanges(); selection.addRange(this.savedRange);
    }

    private setupImageSelection(): void {
        this.editor.nativeElement.addEventListener(
            'click',
            this.handleImageClick
        );
    }

    private handleImageClick = (event: MouseEvent): void => {
        const target = event.target as HTMLElement; if (target.tagName.toLowerCase() === 'img') {
            this.selectImageElement(target as HTMLImageElement);
        } else {
            this.removeImageSelection();
        }
    };

    private selectImageElement(image: HTMLImageElement): void {
        this.removeImageSelection();
        this.selectedImage = image;
        image.classList.add('selected-image');
    }

    private removeImageSelection(): void {
        if (this.selectedImage) {
            this.selectedImage.classList.remove(
                'selected-image'
            );
        }
        this.selectedImage = null;
    }

    resizeImage(event: Event): void {
        if (!this.selectedImage) { alert('Hãy chọn một hình ảnh trước.'); return; } const select = event.target as HTMLSelectElement; const value = select.value; if (!value) { return; } this.selectedImage.style.width = `${value}%`; this.selectedImage.style.height = 'auto'; this.updateValue(); select.value = '';
    }

    onInput(): void {
        this.updateValue();
    }

    markAsTouched(): void {
        this.onTouchedCallback();
    }

    private updateValue(): void {
        if (!this.editor) {
            return;
        }
        const html =
            this.editor
                .nativeElement
                .innerHTML;
        this.onChangeCallback(
            html
        );
    }

    private focusEditor(): void {
        this.editor
            .nativeElement
            .focus();
    }

    undo(): void {
        this.exec('undo');
    }

    redo(): void {
        this.exec('redo');
    }

    onKeyDown(event: KeyboardEvent): void {
        const ctrl = event.ctrlKey || event.metaKey;
        if (ctrl && event.key.toLowerCase() === 'z') { event.preventDefault(); if (event.shiftKey) { this.redo(); } else { this.undo(); } return; }
        if (ctrl && event.key.toLowerCase() === 'y') { event.preventDefault(); this.redo(); }
    }

    async prepareContentForSave(): Promise<string> { if (!this.editor) { return ''; } const editorElement = this.editor.nativeElement; /* * Tìm ảnh chưa upload. */ const images = Array.from(editorElement.querySelectorAll('img[data-local-image-id]')); /* * Không có ảnh mới. */ if (images.length === 0) { return editorElement.innerHTML; } /* * Upload từng ảnh. */ for (const imageElement of images) { const id = imageElement.getAttribute('data-local-image-id'); if (!id) { continue; } const pending = this.pendingImages.get(id); if (!pending) { continue; } /* * Upload. */ const result = await this.uploadImage(pending.file); /* * Thay Blob URL * bằng URL thật. */ imageElement.setAttribute('src', result.url); /* * Xóa ID tạm. */ imageElement.removeAttribute('data-local-image-id'); /* * Giải phóng Blob URL. */ URL.revokeObjectURL(pending.blobUrl); /* * Xóa khỏi danh sách pending. */ this.pendingImages.delete(id); } /* * Lấy HTML cuối cùng. */ const html = editorElement.innerHTML; /* * Cập nhật FormControl. */ this.onChangeCallback(html); return html; }

    private uploadImage(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return firstValueFrom(this.http.post<{ url: string }>(this.apiUrl + '/upload', formData));
    }

    private escapeAttribute(value: string): string {
        return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    writeValue(value: string | null): void {
        if (!this.editor) {
            this.pendingValue = value ?? '';
            return;
        }
        this.editor.nativeElement.innerHTML = value ?? '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: () => void): void { this.onTouchedCallback = fn; }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
        if (!this.editor) return;
        this.editor.nativeElement.contentEditable = disabled ? 'false' : 'true';
    }

    onEditorBlur(): void {
        this.saveSelection();
        this.markAsTouched();
    }
}
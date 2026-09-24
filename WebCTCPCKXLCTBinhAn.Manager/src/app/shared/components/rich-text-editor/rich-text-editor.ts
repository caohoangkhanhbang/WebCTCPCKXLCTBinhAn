// import {
//     Component,
//     ElementRef,
//     ViewChild,
//     forwardRef,
//     inject
// } from '@angular/core';

// import {
//     ControlValueAccessor,
//     NG_VALUE_ACCESSOR
// } from '@angular/forms';

// import { HttpClient } from '@angular/common/http';

// import { firstValueFrom } from 'rxjs';
// import { environment } from '../../../../environments/environment.development';
// import { log } from 'console';


// @Component({
//     selector: 'app-rich-text-editor',

//     standalone: true,

//     templateUrl: './rich-text-editor.html',

//     styleUrl: './rich-text-editor.css',

//     providers: [
//         {
//             provide: NG_VALUE_ACCESSOR,
//             useExisting: forwardRef(
//                 () => RichTextEditorComponent
//             ),
//             multi: true
//         }
//     ]
// })
// export class RichTextEditorComponent
//     implements ControlValueAccessor {

//     private http = inject(HttpClient);
//     private readonly apiUrl = environment.apiUrl + '/RichTextEditor';


//     @ViewChild('editor')
//     editor!: ElementRef<HTMLDivElement>;


//     @ViewChild('imageInput')
//     imageInput!: ElementRef<HTMLInputElement>;


//     private disabled = false;


//     private onChange: (value: string) => void = () => { };

//     onTouched: () => void = () => { };


//     // =====================================================
//     // BASIC COMMAND
//     // =====================================================

//     exec(command: string): void {

//         if (this.disabled) {
//             return;
//         }

//         this.focusEditor();

//         document.execCommand(
//             command,
//             false
//         );

//         this.updateValue();
//     }


//     // =====================================================
//     // HEADING
//     // =====================================================

//     formatBlock(event: Event): void {

//         if (this.disabled) {
//             return;
//         }

//         const select =
//             event.target as HTMLSelectElement;

//         this.focusEditor();

//         document.execCommand(
//             'formatBlock',
//             false,
//             select.value
//         );

//         this.updateValue();
//     }


//     // =====================================================
//     // FONT SIZE
//     // =====================================================

//     fontSize(event: Event): void {

//         if (this.disabled) {
//             return;
//         }

//         const select =
//             event.target as HTMLSelectElement;

//         if (!select.value) {
//             return;
//         }

//         this.focusEditor();

//         document.execCommand(
//             'fontSize',
//             false,
//             select.value
//         );

//         this.updateValue();

//         select.value = '';
//     }


//     // =====================================================
//     // TEXT COLOR
//     // =====================================================

//     foreColor(color: string): void {

//         if (this.disabled) {
//             return;
//         }

//         this.focusEditor();

//         document.execCommand(
//             'foreColor',
//             false,
//             color
//         );

//         this.updateValue();
//     }


//     // =====================================================
//     // LINK
//     // =====================================================

//     insertLink(): void {

//         if (this.disabled) {
//             return;
//         }

//         this.focusEditor();

//         const url = window.prompt(
//             'Nhập URL:',
//             'https://'
//         );

//         if (!url) {
//             return;
//         }

//         document.execCommand(
//             'createLink',
//             false,
//             url
//         );

//         this.updateValue();
//     }


//     // =====================================================
//     // IMAGE
//     // =====================================================

//     selectImage(): void {

//         if (this.disabled) {
//             return;
//         }

//         this.saveSelection();

//         this.imageInput.nativeElement.click();
//     }


//     async onImageSelected(
//         event: Event
//     ): Promise<void> {

//         const input =
//             event.target as HTMLInputElement;

//         const file =
//             input.files?.[0];

//         if (!file) {
//             return;
//         }


//         // Kiểm tra loại file
//         const allowedTypes = [
//             'image/jpeg',
//             'image/png',
//             'image/webp'
//         ];

//         if (!allowedTypes.includes(file.type)) {

//             alert(
//                 'Chỉ cho phép JPG, PNG hoặc WEBP.'
//             );

//             input.value = '';

//             return;
//         }


//         // Kiểm tra dung lượng
//         const maxSize =
//             5 * 1024 * 1024;

//         if (file.size > maxSize) {

//             alert(
//                 'Ảnh không được lớn hơn 5MB.'
//             );

//             input.value = '';

//             return;
//         }


//         try {

//             const result =
//                 await this.uploadImage(file);

//             // xóa
//             console.log('Upload result:', result);
//             this.restoreSelection();


//             this.insertImage(
//                 result.url
//             );

//         }
//         catch (error) {

//             console.error(error);

//             alert(
//                 'Upload ảnh thất bại.2'
//             );

//         }


//         input.value = '';
//     }


//     // =====================================================
//     // UPLOAD IMAGE
//     // =====================================================

//     private uploadImage(file: File) {

//         const formData =
//             new FormData();

//         formData.append(
//             'file',
//             file
//         );


//         return firstValueFrom(
//             this.http.post<{ url: string }>(this.apiUrl + '/upload', formData)
//         );
//     }


//     // =====================================================
//     // INSERT IMAGE
//     // =====================================================

//     private insertImage(
//         url: string
//     ): void {

//         this.focusEditor();


//         const html = `
//       <img
//         src="${this.escapeAttribute(url)}"
//         alt=""
//       >
//     `;


//         document.execCommand(
//             'insertHTML',
//             false,
//             html
//         );


//         this.updateValue();
//     }


//     // =====================================================
//     // SELECTION
//     // =====================================================

//     private savedRange: Range | null = null;


//     private saveSelection(): void {

//         const selection =
//             window.getSelection();

//         if (!selection) {
//             return;
//         }

//         if (
//             selection.rangeCount === 0
//         ) {
//             return;
//         }

//         this.savedRange =
//             selection.getRangeAt(0);
//     }


//     private restoreSelection(): void {

//         if (!this.savedRange) {
//             return;
//         }

//         const selection =
//             window.getSelection();

//         if (!selection) {
//             return;
//         }

//         selection.removeAllRanges();

//         selection.addRange(
//             this.savedRange
//         );
//     }


//     // =====================================================
//     // INPUT
//     // =====================================================

//     onInput(): void {
//         this.updateValue();
//     }


//     private updateValue(): void {

//         const html =
//             this.editor
//                 .nativeElement
//                 .innerHTML;

//         this.onChange(html);
//     }


//     // =====================================================
//     // PASTE
//     // =====================================================

//     onPaste(event: ClipboardEvent): void {

//         event.preventDefault();


//         const text =
//             event.clipboardData
//                 ?.getData('text/plain');


//         if (!text) {
//             return;
//         }


//         document.execCommand(
//             'insertText',
//             false,
//             text
//         );


//         this.updateValue();
//     }


//     // =====================================================
//     // FOCUS
//     // =====================================================

//     private focusEditor(): void {

//         this.editor
//             .nativeElement
//             .focus();
//     }


//     // =====================================================
//     // HTML ATTRIBUTE ESCAPE
//     // =====================================================

//     private escapeAttribute(
//         value: string
//     ): string {

//         return value
//             .replace(/&/g, '&amp;')
//             .replace(/"/g, '&quot;')
//             .replace(/</g, '&lt;')
//             .replace(/>/g, '&gt;');
//     }


//     // =====================================================
//     // CONTROL VALUE ACCESSOR
//     // =====================================================

//     writeValue(
//         value: string | null
//     ): void {

//         if (!this.editor) {
//             return;
//         }

//         this.editor
//             .nativeElement
//             .innerHTML =
//             value ?? '';
//     }


//     registerOnChange(
//         fn: (value: string) => void
//     ): void {

//         this.onChange = fn;
//     }


//     registerOnTouched(
//         fn: () => void
//     ): void {

//         this.onTouched = fn;
//     }


//     setDisabledState(
//         disabled: boolean
//     ): void {

//         this.disabled = disabled;

//         if (!this.editor) {
//             return;
//         }

//         this.editor
//             .nativeElement
//             .contentEditable =
//             disabled ? 'false' : 'true';
//     }

// }


import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    forwardRef,
    inject
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

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


    // =====================================================
    // DEPENDENCIES
    // =====================================================

    private http = inject(HttpClient);

    private readonly apiUrl =
        environment.apiUrl + '/RichTextEditor';


    // =====================================================
    // ELEMENT
    // =====================================================

    @ViewChild('editor')
    editor!: ElementRef<HTMLDivElement>;

    @ViewChild('imageInput')
    imageInput!: ElementRef<HTMLInputElement>;


    // =====================================================
    // STATE
    // =====================================================

    private disabled = false;

    private pendingValue: string | null = null;

    private savedRange: Range | null = null;


    /**
     * Các ảnh mới thêm vào editor
     * nhưng chưa upload lên server.
     */
    private pendingImages =
        new Map<string, PendingImage>();


    /**
     * Ảnh hiện tại đang được chọn.
     */
    private selectedImage:
        HTMLImageElement | null = null;


    // =====================================================
    // CONTROL VALUE ACCESSOR
    // =====================================================

    private onChangeCallback:
        (value: string) => void = () => { };


    private onTouchedCallback:
        () => void = () => { };


    // =====================================================
    // LIFECYCLE
    // =====================================================

    ngAfterViewInit(): void {

        if (this.pendingValue !== null) {

            this.editor.nativeElement.innerHTML =
                this.pendingValue;

            this.pendingValue = null;
        }

        this.setupImageSelection();
    }


    ngOnDestroy(): void {

        /*
         * Giải phóng Blob URL.
         */

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


    // =====================================================
    // BASIC COMMAND
    // =====================================================

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


    // =====================================================
    // HEADING
    // =====================================================
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



    // =====================================================
    // FONT SIZE
    // =====================================================

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


    // =====================================================
    // TEXT COLOR
    // =====================================================

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


    // =====================================================
    // ALIGN
    // =====================================================

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


    // =====================================================
    // LINK
    // =====================================================

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


    // =====================================================
    // REMOVE LINK
    // =====================================================

    removeLink(): void {

        this.exec('unlink');
    }


    // =====================================================
    // IMAGE SELECT
    // =====================================================

    selectImage(): void {

        if (this.disabled) {
            return;
        }

        this.saveSelection();

        this.imageInput.nativeElement.click();
    }


    // =====================================================
    // IMAGE SELECTED
    // =====================================================

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


    // =====================================================
    // INSERT LOCAL IMAGE
    // =====================================================

    private async insertLocalImage(
        file: File
    ): Promise<void> {

        if (!this.isValidImage(file)) {
            return;
        }

        const blobUrl =
            URL.createObjectURL(file);

        const id =
            crypto.randomUUID();


        /*
         * Lưu ảnh vào bộ nhớ tạm.
         *
         * CHƯA upload API.
         */

        this.pendingImages.set(
            id,
            {
                id,
                file,
                blobUrl
            }
        );


        /*
         * Khôi phục vị trí con trỏ.
         */

        this.restoreSelection();

        this.focusEditor();


        /*
         * Chèn ảnh vào editor.
         */

        const html = `
            <img
                src="${this.escapeAttribute(blobUrl)}"
                data-local-image-id="${id}"
                alt=""
            >
        `;


        document.execCommand(
            'insertHTML',
            false,
            html
        );


        this.updateValue();
    }


    // =====================================================
    // VALIDATE IMAGE
    // =====================================================

    private isValidImage(
        file: File
    ): boolean {

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml'
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                'Chỉ cho phép JPG, PNG, WEBP, GIF hoặc SVG.'
            );

            return false;
        }


        const maxSize =
            5 * 1024 * 1024;


        if (file.size > maxSize) {

            alert(
                'Ảnh không được lớn hơn 5MB.'
            );

            return false;
        }


        return true;
    }


    // =====================================================
    // PASTE
    // =====================================================

    async onPaste(
        event: ClipboardEvent
    ): Promise<void> {

        event.preventDefault();

        const clipboard =
            event.clipboardData;

        if (!clipboard) {
            return;
        }


        // -------------------------------------------------
        // COPY IMAGE
        // -------------------------------------------------

        const imageItem =
            Array.from(
                clipboard.items
            ).find(
                item =>
                    item.type.startsWith(
                        'image/'
                    )
            );


        if (imageItem) {

            const file =
                imageItem.getAsFile();

            if (file) {

                await this.insertLocalImage(
                    file
                );

                return;
            }
        }


        // -------------------------------------------------
        // COPY HTML
        // -------------------------------------------------

        const html =
            clipboard.getData(
                'text/html'
            );


        if (html) {

            this.insertPastedHtml(
                html
            );

            return;
        }


        // -------------------------------------------------
        // COPY TEXT
        // -------------------------------------------------

        const text =
            clipboard.getData(
                'text/plain'
            );


        if (text) {

            this.focusEditor();

            document.execCommand(
                'insertText',
                false,
                text
            );

            this.updateValue();
        }
    }


    // =====================================================
    // PASTE HTML
    // =====================================================

    private insertPastedHtml(
        html: string
    ): void {

        const cleanHtml =
            this.sanitizePastedHtml(
                html
            );

        this.focusEditor();

        document.execCommand(
            'insertHTML',
            false,
            cleanHtml
        );

        this.updateValue();
    }


    // =====================================================
    // SANITIZE PASTED HTML
    // =====================================================

    private sanitizePastedHtml(
        html: string
    ): string {

        const parser =
            new DOMParser();

        const parsed =
            parser.parseFromString(
                html,
                'text/html'
            );


        /*
         * Xóa tag nguy hiểm.
         */

        const dangerousTags = [
            'script',
            'style',
            'iframe',
            'object',
            'embed',
            'form',
            'input',
            'button',
            'textarea',
            'select'
        ];


        for (
            const tag
            of dangerousTags
        ) {

            parsed
                .querySelectorAll(tag)
                .forEach(element =>
                    element.remove()
                );
        }


        /*
         * Xóa onclick, onload,
         * onerror...
         */

        parsed
            .querySelectorAll('*')
            .forEach(element => {

                for (
                    const attribute
                    of Array.from(
                        element.attributes
                    )
                ) {

                    if (
                        attribute.name
                            .toLowerCase()
                            .startsWith('on')
                    ) {

                        element.removeAttribute(
                            attribute.name
                        );
                    }
                }
            });


        return parsed.body.innerHTML;
    }


    // =====================================================
    // DRAG & DROP
    // =====================================================

    onDragOver(
        event: DragEvent
    ): void {

        event.preventDefault();
    }


    async onDrop(
        event: DragEvent
    ): Promise<void> {

        event.preventDefault();

        if (this.disabled) {
            return;
        }


        const files =
            Array.from(
                event.dataTransfer?.files ?? []
            );


        if (files.length === 0) {
            return;
        }


        /*
         * Đặt caret tại vị trí drop.
         */

        this.setCaretFromPoint(
            event.clientX,
            event.clientY
        );


        for (
            const file
            of files
        ) {

            if (
                file.type.startsWith(
                    'image/'
                )
            ) {

                await this.insertLocalImage(
                    file
                );
            }
        }
    }


    // =====================================================
    // CARET FROM MOUSE
    // =====================================================

    private setCaretFromPoint(
        x: number,
        y: number
    ): void {

        const documentAny =
            document as any;

        let range: Range | null = null;


        if (
            documentAny.caretRangeFromPoint
        ) {

            range =
                documentAny.caretRangeFromPoint(
                    x,
                    y
                );
        }


        else if (
            documentAny.caretPositionFromPoint
        ) {

            const position =
                documentAny.caretPositionFromPoint(
                    x,
                    y
                );


            if (position) {

                range =
                    document.createRange();

                range.setStart(
                    position.offsetNode,
                    position.offset
                );

                range.collapse(true);
            }
        }


        if (!range) {
            return;
        }


        const selection =
            window.getSelection();


        if (!selection) {
            return;
        }


        selection.removeAllRanges();

        selection.addRange(
            range
        );


        this.savedRange =
            range.cloneRange();
    }


    // =====================================================
    // SELECTION
    // =====================================================

    private saveSelection(): void {

        const selection =
            window.getSelection();


        if (
            !selection ||
            selection.rangeCount === 0
        ) {
            return;
        }


        const range =
            selection.getRangeAt(0);


        if (
            !this.editor.nativeElement.contains(
                range.commonAncestorContainer
            )
        ) {
            return;
        }


        this.savedRange =
            range.cloneRange();
    }


    private restoreSelection(): void {

        if (!this.savedRange) {
            return;
        }


        const selection =
            window.getSelection();


        if (!selection) {
            return;
        }


        selection.removeAllRanges();

        selection.addRange(
            this.savedRange
        );
    }


    // =====================================================
    // IMAGE SELECTION
    // =====================================================

    private setupImageSelection(): void {

        this.editor.nativeElement
            .addEventListener(
                'click',
                this.handleImageClick
            );
    }


    private handleImageClick =
        (event: MouseEvent): void => {

            const target =
                event.target as HTMLElement;


            if (
                target.tagName.toLowerCase()
                === 'img'
            ) {

                this.selectImageElement(
                    target as HTMLImageElement
                );

            } else {

                this.removeImageSelection();
            }
        };


    private selectImageElement(
        image: HTMLImageElement
    ): void {

        this.removeImageSelection();

        this.selectedImage =
            image;

        image.classList.add(
            'selected-image'
        );
    }


    private removeImageSelection(): void {

        if (this.selectedImage) {

            this.selectedImage.classList.remove(
                'selected-image'
            );
        }

        this.selectedImage = null;
    }


    // =====================================================
    // IMAGE RESIZE
    // =====================================================

    resizeImage(event: Event): void {

        if (!this.selectedImage) {

            alert(
                'Hãy chọn một hình ảnh trước.'
            );

            return;
        }

        const select =
            event.target as HTMLSelectElement;

        const value =
            select.value;

        if (!value) {
            return;
        }

        this.selectedImage.style.width =
            `${value}%`;

        this.selectedImage.style.height =
            'auto';

        this.updateValue();

        select.value = '';
    }


    // =====================================================
    // INPUT
    // =====================================================

    onInput(): void {

        this.updateValue();
    }


    // =====================================================
    // BLUR
    // =====================================================

    markAsTouched(): void {

        this.onTouchedCallback();
    }


    // =====================================================
    // UPDATE VALUE
    // =====================================================

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


    // =====================================================
    // FOCUS
    // =====================================================

    private focusEditor(): void {

        this.editor
            .nativeElement
            .focus();
    }


    // =====================================================
    // UNDO / REDO
    // =====================================================

    undo(): void {

        this.exec('undo');
    }


    redo(): void {

        this.exec('redo');
    }


    // =====================================================
    // KEYBOARD
    // =====================================================

    onKeyDown(
        event: KeyboardEvent
    ): void {

        const ctrl =
            event.ctrlKey ||
            event.metaKey;


        // Ctrl + Z

        if (
            ctrl &&
            event.key.toLowerCase() === 'z'
        ) {

            event.preventDefault();


            if (event.shiftKey) {

                this.redo();

            } else {

                this.undo();
            }


            return;
        }


        // Ctrl + Y

        if (
            ctrl &&
            event.key.toLowerCase() === 'y'
        ) {

            event.preventDefault();

            this.redo();
        }
    }


    // =====================================================
    // PREPARE CONTENT FOR SAVE
    // =====================================================

    async prepareContentForSave():
        Promise<string> {

        if (!this.editor) {
            return '';
        }


        const editorElement =
            this.editor.nativeElement;


        /*
         * Tìm ảnh chưa upload.
         */

        const images =
            Array.from(
                editorElement.querySelectorAll(
                    'img[data-local-image-id]'
                )
            );


        /*
         * Không có ảnh mới.
         */

        if (images.length === 0) {

            return editorElement.innerHTML;
        }


        /*
         * Upload từng ảnh.
         */

        for (
            const imageElement
            of images
        ) {

            const id =
                imageElement.getAttribute(
                    'data-local-image-id'
                );


            if (!id) {
                continue;
            }


            const pending =
                this.pendingImages.get(
                    id
                );


            if (!pending) {
                continue;
            }


            /*
             * Upload.
             */

            const result =
                await this.uploadImage(
                    pending.file
                );


            /*
             * Thay Blob URL
             * bằng URL thật.
             */

            imageElement.setAttribute(
                'src',
                result.url
            );


            /*
             * Xóa ID tạm.
             */

            imageElement.removeAttribute(
                'data-local-image-id'
            );


            /*
             * Giải phóng Blob URL.
             */

            URL.revokeObjectURL(
                pending.blobUrl
            );


            /*
             * Xóa khỏi danh sách pending.
             */

            this.pendingImages.delete(
                id
            );
        }


        /*
         * Lấy HTML cuối cùng.
         */

        const html =
            editorElement.innerHTML;


        /*
         * Cập nhật FormControl.
         */

        this.onChangeCallback(
            html
        );


        return html;
    }


    // =====================================================
    // UPLOAD IMAGE
    // =====================================================

    private uploadImage(
        file: File
    ): Promise<{ url: string }> {

        const formData =
            new FormData();


        formData.append(
            'file',
            file
        );


        return firstValueFrom(
            this.http.post<{ url: string }>(
                this.apiUrl + '/upload',
                formData
            )
        );
    }


    // =====================================================
    // ESCAPE ATTRIBUTE
    // =====================================================

    private escapeAttribute(
        value: string
    ): string {

        return value
            .replace(
                /&/g,
                '&amp;'
            )
            .replace(
                /"/g,
                '&quot;'
            )
            .replace(
                /</g,
                '&lt;'
            )
            .replace(
                />/g,
                '&gt;'
            );
    }


    // =====================================================
    // CONTROL VALUE ACCESSOR
    // =====================================================

    writeValue(
        value: string | null
    ): void {

        if (!this.editor) {

            this.pendingValue =
                value ?? '';

            return;
        }


        this.editor.nativeElement.innerHTML =
            value ?? '';
    }


    registerOnChange(
        fn: (value: string) => void
    ): void {

        this.onChangeCallback =
            fn;
    }


    registerOnTouched(
        fn: () => void
    ): void {

        this.onTouchedCallback =
            fn;
    }


    setDisabledState(
        disabled: boolean
    ): void {

        this.disabled =
            disabled;


        if (!this.editor) {
            return;
        }


        this.editor
            .nativeElement
            .contentEditable =
            disabled
                ? 'false'
                : 'true';
    }
    
    onEditorBlur(): void {

        this.saveSelection();

        this.markAsTouched();
    }
}
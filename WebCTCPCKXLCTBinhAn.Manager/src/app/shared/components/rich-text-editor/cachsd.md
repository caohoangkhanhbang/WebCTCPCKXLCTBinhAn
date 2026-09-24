<!-- trong component cha -->
import {
    ViewChild
} from '@angular/core';

import {
    RichTextEditorComponent
} from '../../shared/components/rich-text-editor/rich-text-editor';

@ViewChild(RichTextEditorComponent)
editor!: RichTextEditorComponent;

<!-- Khi bấm nút lưu -->
async save(): Promise<void> {

    try {

        /*
         * Upload các ảnh mới
         * và lấy HTML cuối cùng.
         */

        const content =
            await this.editor.prepareContentForSave();


        const request = {

            title:
                this.form.value.title,

            content:
                content
        };


        /*
         * Gửi bài viết lên API.
         */

        this.articleService
            .create(request)
            .subscribe({

                next: () => {

                    alert(
                        'Lưu bài viết thành công.'
                    );
                },

                error: error => {

                    console.error(
                        error
                    );

                    alert(
                        'Lưu bài viết thất bại.'
                    );
                }

            });

    }
    catch (error) {

        console.error(
            'Prepare editor failed:',
            error
        );

        alert(
            'Không thể xử lý hình ảnh.'
        );
    }
}
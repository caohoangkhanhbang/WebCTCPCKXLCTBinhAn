import { Component, inject } from "@angular/core";
import { AnnouncementService } from "../announcement-service";
import { KBDialog } from "../announcement-dialog/kbdialog";

@Component({
    selector: 'kb-announcement',
    standalone: true,
    imports: [KBDialog],
    templateUrl: './kbdialog-host.html'
})

export class KBAnouncement {
    dialog = inject(AnnouncementService);
    handleAction(value: string) {
        this.dialog.close(value);
    }
}
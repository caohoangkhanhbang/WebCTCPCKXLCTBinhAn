import { Component, inject } from "@angular/core";
import { KBWaitingService } from "./kbwaiting-service";
import { KBWaiting } from './kbwaiting';
@Component({
    selector: 'app-kb-waiting-host',
    templateUrl: './kbwaiting-host.html',
    imports: [KBWaiting]
})

export class KBWaitingHost {
    service = inject(KBWaitingService);
}
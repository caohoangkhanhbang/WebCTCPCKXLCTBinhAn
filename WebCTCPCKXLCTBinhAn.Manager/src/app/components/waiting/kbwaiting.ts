import { Component, input } from "@angular/core";

@Component({
    selector: 'app-kb-waiting',
    templateUrl: './kbwaiting.html',
    styleUrl: './kbwaiting.css',
    standalone: true,
})

export class KBWaiting {
    isOpen = input<boolean>(false);
}
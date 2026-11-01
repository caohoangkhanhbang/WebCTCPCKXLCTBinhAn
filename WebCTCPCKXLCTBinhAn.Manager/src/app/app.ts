import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KBAnouncement } from './components/dialog/announcement-host/kbdialog-host';
import { KBWaitingHost } from './components/waiting/kbwaiting-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KBAnouncement, KBWaitingHost],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Điều hành Giao diện CTCPCKXLCTBinhAn');
}

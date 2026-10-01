import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KBAnouncement } from './components/dialog/announcement-host/kbdialog-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KBAnouncement],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('WebCTCPCKXLCTBinhAn.Manager');
}

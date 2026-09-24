import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.css',
    standalone: true,
    imports: [RouterOutlet, RouterLink]
})
export class MainLayout {

}
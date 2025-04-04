import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PantryitemComponent } from "./pantryitem/pantryitem.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, PantryitemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pantrypal-ui';
}

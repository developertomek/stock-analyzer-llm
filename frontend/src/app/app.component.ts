import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1 class="text-red-500">{{ title }}</h1>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'Stock Analyzer';
}

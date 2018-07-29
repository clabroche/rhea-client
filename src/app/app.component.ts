import { Component } from '@angular/core';
import { CltThemeService } from 'ngx-callisto/dist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(theme: CltThemeService) {}
}

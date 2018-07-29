import { Component } from '@angular/core';
import { CltThemeService, CltSideBarService, Configuration } from 'ngx-callisto/dist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  sidebarConf: Configuration
  constructor(theme: CltThemeService, public sidebarService: CltSideBarService) {
    this.sidebarConf= {
      list: [
        {
          icon: "fas fa-home",
          description:'Listes',
          url: '/shoppingLists'
        }
      ]     
    }
    let touchStart;
    document.addEventListener('touchstart', (ev => {
      touchStart = ev.touches[0].clientX
    }))
    document.addEventListener('touchmove', (ev => {
      const delta = ev.touches[0].clientX - touchStart
      if (touchStart < 20 && delta > 100) sidebarService.open()
      if (touchStart > window.innerWidth - 20 && delta < -100) sidebarService.close()
    }))
  }
}

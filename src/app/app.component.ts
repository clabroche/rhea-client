import { Component, OnInit } from '@angular/core';
import { CltThemeService, CltSideBarService, Configuration, CltNotificationsService } from 'ngx-callisto/dist';
import { AuthService, AuthError } from '../auth/auth.service';
import { GraphQLError } from '../graphQL/graphQL.module';
import { merge } from 'rxjs';
import { CommonService } from './providers/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  sidebarConf: Configuration;
  constructor(
    theme: CltThemeService,
    public sidebarService: CltSideBarService,
    public authservice: AuthService,
    private notifService: CltNotificationsService,
    public common: CommonService,
  ) {
    this.sidebarConf = {
      list: [
        {
          icon: 'fas fa-list',
          description: 'Listes',
          url: '/shoppingLists',
          click: _=> { this.sidebarService.close() }
        }, {
          icon: 'fas fa-cookie-bite',
          description: 'Items',
          url: '/items',
          click: _ => { this.sidebarService.close() }
        }, {
          icon: 'fas fa-th-large',
          description: 'Categories',
          url: '/categories',
          click: _ => { this.sidebarService.close() }
        }, {
          icon: 'fas fa-book',
          description: 'Inventaire',
          url: '/inventory',
          click: _ => { this.sidebarService.close() }
        }, {
          icon: 'fas fa-utensil-spoon',
          description: 'Recettes',
          url: '/recipes',
          click: _ => { this.sidebarService.close() }
        }
      ],
      bottom: [
        {
          icon: 'fas fa-cog',
          description: 'Paramètres',
          url: '/settings',
          click: _ => { this.sidebarService.close() }
        }
      ]
    };
    let touchStart;
    document.addEventListener('touchstart', (ev => {
      touchStart = ev.touches[0].clientX;
    }));
    document.addEventListener('touchmove', (ev => {
      const delta = ev.touches[0].clientX - touchStart;
      if (touchStart < 20 && delta > 100) sidebarService.open();
      if (touchStart > window.innerWidth - 20 && delta < -100) sidebarService.close();
    }));
  }
  ngOnInit() {
    merge(AuthError, GraphQLError).subscribe(({ message, code, deleteAll }) => {
      if (deleteAll) {
        setTimeout(() => {
          this.notifService.deleteAll();
          this.notifService.add(message.title, message.detail);
        }, 10);
      } else {
        this.notifService.add(message.title, message.detail);
      }
    });
  }
  getName() {
    return this.common.routeName;
  }

}

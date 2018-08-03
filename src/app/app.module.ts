import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonService } from './providers/common.service';
import { CltNavigationsModule, CltOverlayModule, CltFormsModule } from 'ngx-callisto/dist';
import { GraphQLModule } from '../graphQL/graphQL.module';
import { AuthModule } from '../auth/auth.module';
import { AuthPageComponent } from './authPage/authPage.component';
import { AuthService } from '../auth/auth.service';
import { RheaSdkModule } from './rhea-sdk/rhea-sdk.module';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ItemModule } from './item/item.module';
registerLocaleData(localeFr, 'fr');
@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CltNavigationsModule.forRoot(),
    CltOverlayModule.forRoot(),
    RheaSdkModule,
    CltFormsModule,
    RouterModule.forRoot([
      { path: '', resolve: { authService: AuthService }, children: [
          { path: '', redirectTo: '/shoppingLists', pathMatch: 'full'},
          { path: 'shoppingLists', loadChildren: 'src/app/shopping-list/shopping-list.module#ShoppingListModule'},
          { path: 'categories', loadChildren: 'src/app/category/category.module#CategoryModule'},
          { path: 'items', loadChildren: 'src/app/item/item.module#ItemModule'}
        ]
      }
    ]),
    GraphQLModule.forRoot(),
    AuthModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonService } from './providers/common.service';
import { CltNavigationsModule } from 'ngx-callisto/dist';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CltNavigationsModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: '/shoppingLists', pathMatch: 'full'},
      { path: 'shoppingLists', loadChildren: 'src/app/shopping-list/shopping-list.module#ShoppingListModule'}
    ])
  ],
  providers: [CommonService],
  entryComponents:[],
  bootstrap: [AppComponent]
})
export class AppModule { }

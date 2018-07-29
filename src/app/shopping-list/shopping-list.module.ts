import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShoppingListsComponent } from './shopping-lists/shopping-lists.component';
import { CltOverlayModule } from 'ngx-callisto/dist';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

@NgModule({
  imports: [
    CltOverlayModule,
    RheaSdkModule,
    RouterModule.forChild([
      { path: '', component: ShoppingListsComponent },
      { path: ':id', component: ShoppingListComponent }
    ])
  ],
  declarations: [
    ShoppingListsComponent,
    ShoppingListComponent
  ]
})
export class ShoppingListModule { }

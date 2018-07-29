import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShoppingListsComponent } from './shopping-lists/shopping-lists.component';
import { CltOverlayModule } from 'ngx-callisto/dist';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';

@NgModule({
  imports: [
    CltOverlayModule,
    RheaSdkModule,
    RouterModule.forChild([
      {path: '', component: ShoppingListsComponent}
    ])
  ],
  declarations: [
    ShoppingListsComponent
  ]
})
export class ShoppingListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoppingListsComponent } from './shopping-lists/shopping-lists.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: ShoppingListsComponent}
    ])
  ],
  declarations: [
    ShoppingListsComponent
  ]
})
export class ShoppingListModule { }

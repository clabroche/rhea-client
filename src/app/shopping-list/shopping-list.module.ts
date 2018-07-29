import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoppingListsComponent } from './shopping-lists/shopping-lists.component';
import { CltOverlayModule, CltFormsModule } from 'ngx-callisto/dist';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CltOverlayModule,
    ReactiveFormsModule,
    CltFormsModule,
    RouterModule.forChild([
      {path: '', component: ShoppingListsComponent}
    ])
  ],
  declarations: [
    ShoppingListsComponent
  ]
})
export class ShoppingListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { ItemsComponent } from './items/items.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ItemComponent, ItemsComponent]
})
export class ItemModule { }

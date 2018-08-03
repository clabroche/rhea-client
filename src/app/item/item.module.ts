import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { ItemsComponent } from './items/items.component';
import { RouterModule } from '@angular/router';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { CltOverlayModule } from 'ngx-callisto/dist';

@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    CltOverlayModule,
    RouterModule.forChild([
      {path:'items', component: ItemsComponent}
    ])
  ],
  declarations: [ItemComponent, ItemsComponent]
})
export class ItemModule { }

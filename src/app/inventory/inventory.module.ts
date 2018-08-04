import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory/inventory.component';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { RouterModule } from '@angular/router';
import { CltOverlayModule } from 'ngx-callisto/dist';

@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    CltOverlayModule,
    RouterModule.forChild([
      {path: '', component: InventoryComponent}
    ])
  ],
  declarations: [InventoryComponent]
})
export class InventoryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { RouterModule } from '@angular/router';
import { CltOverlayModule } from 'ngx-callisto/dist';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    CltOverlayModule,
    TableModule,
    RouterModule.forChild([
      { path: '', component: CategoriesComponent }
    ])
  ],
  declarations: [CategoriesComponent]
})
export class CategoryModule { }

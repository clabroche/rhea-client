import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CltFormsModule } from 'ngx-callisto/dist';
import { RheaCardComponent } from './rhea-card/rhea-card.component';

@NgModule({
  imports: [
    CommonModule,
    CltFormsModule,
    ReactiveFormsModule,
  ],
  declarations: [RheaCardComponent],
  exports: [
    CommonModule,
    CltFormsModule,
    ReactiveFormsModule,
    RheaCardComponent
  ]
})
export class RheaSdkModule { }

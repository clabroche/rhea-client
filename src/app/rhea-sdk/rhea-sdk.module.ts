import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CltFormsModule, CltCoreModule } from 'ngx-callisto/dist';
import { RheaCardComponent } from './rhea-card/rhea-card.component';
import { RheaBarBottomComponent } from './rhea-bar-bottom/rhea-bar-bottom.component';

@NgModule({
  imports: [
    CommonModule,
    CltFormsModule,
    ReactiveFormsModule,
    CltCoreModule.forRoot()
  ],
  declarations: [RheaCardComponent, RheaBarBottomComponent],
  exports: [
    CommonModule,
    CltFormsModule,
    ReactiveFormsModule,
    RheaCardComponent,
    RheaBarBottomComponent
  ]
})
export class RheaSdkModule { }

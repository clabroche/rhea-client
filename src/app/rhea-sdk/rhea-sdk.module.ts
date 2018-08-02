import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CltFormsModule, CltCoreModule } from 'ngx-callisto/dist';
import { RheaCardComponent } from './rhea-card/rhea-card.component';
import { RheaBarBottomComponent } from './rhea-bar-bottom/rhea-bar-bottom.component';
import { CltAutocompleteDirective } from './directives/clt-autocomplete.directive';

@NgModule({
  imports: [
    CommonModule,
    CltFormsModule,
    ReactiveFormsModule,
    CltCoreModule.forRoot()
  ],
  declarations: [
    RheaCardComponent,
    RheaBarBottomComponent,
    CltAutocompleteDirective
  ],
  exports: [
    CommonModule,
    CltFormsModule,
    ReactiveFormsModule,
    RheaCardComponent,
    RheaBarBottomComponent,
    CltAutocompleteDirective
  ]
})
export class RheaSdkModule { }

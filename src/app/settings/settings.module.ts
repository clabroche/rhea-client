import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    RouterModule.forChild([
      { path: '', component: SettingsComponent} 
    ])
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }

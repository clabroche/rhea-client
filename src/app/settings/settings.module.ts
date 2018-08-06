import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { RouterModule } from '@angular/router';
import { CltContainersModule, CltThemeModule } from 'ngx-callisto/dist';

@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    CltContainersModule,
    CltThemeModule,
    RouterModule.forChild([
      { path: '', component: SettingsComponent} 
    ])
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }

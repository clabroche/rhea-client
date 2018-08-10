import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { RouterModule } from '@angular/router';
import { CltContainersModule, CltThemeModule, CltOverlayModule } from 'ngx-callisto/dist';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    CltContainersModule,
    CltThemeModule,
    CltOverlayModule,
    TableModule,
    RouterModule.forChild([
      { path: '', component: SettingsComponent} 
    ])
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule as PCalendarModule, RadioButtonModule } from 'primeng/primeng';
import { RouterModule } from '@angular/router';
import { ScheduleModule } from 'primeng/primeng';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { CltOverlayModule } from 'ngx-callisto/dist';
import { DpDatePickerModule } from 'ng2-date-picker';

@NgModule({
  imports: [
    CommonModule,
    ScheduleModule,
    RheaSdkModule,
    CltOverlayModule,
    DpDatePickerModule,
    RadioButtonModule,
    PCalendarModule,
    RouterModule.forChild([
      { path: '', component: CalendarComponent }
    ])
  ],
  declarations: [CalendarComponent]
})
export class CalendarModule { }

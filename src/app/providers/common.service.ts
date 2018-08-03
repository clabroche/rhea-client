import { Injectable, ChangeDetectorRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  routeName: string;
  refreshInterval = 750;
  constructor() { }
  updateHeader(title: string) {
    this.routeName = title;
  }
}

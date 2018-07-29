import { Injectable, ChangeDetectorRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  routeName: string;
  constructor() { }
  updateHeader(title: string) {
    this.routeName = title;
  }
}

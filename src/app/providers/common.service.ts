import { Injectable } from '@angular/core';
import { mergeWith as _merge } from 'lodash';

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
  merge(srcToKeep, value) {
    return _merge(srcToKeep, value, (value, srcValue) => {
      if (Array.isArray(value) && srcValue.length < value.length)
        return srcValue
    })
  }
}

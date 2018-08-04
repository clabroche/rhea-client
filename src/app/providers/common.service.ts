import { Injectable } from '@angular/core';
import { mergeWith as _merge } from 'lodash';
import { CltCommonService } from 'ngx-callisto/dist';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  routeName: string;
  refreshInterval = 750;
  constructor(private clt: CltCommonService) { }
  updateHeader(title: string) {
    this.routeName = title;
  }
  merge(srcToKeep, value) {
    if(Array.isArray(srcToKeep) && srcToKeep.length > value.length) return value;
    return _merge(srcToKeep, value, (value, srcValue) => {
      if (Array.isArray(value) && srcValue.length < value.length)
        return srcValue
    })
  }
}

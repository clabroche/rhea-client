import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
declare var $: any;
import * as uuidV4 from 'uuid/v4';
export interface CardItem {
  title: string;
  description: string;
}
@Component({
  selector: 'rhea-card',
  templateUrl: './rhea-card.component.html',
  styleUrls: ['./rhea-card.component.scss']
})
export class RheaCardComponent implements OnChanges {

  @Input() uuid: string;
  @Input() title: string;
  @Input() description: string;
  @Input() additionalText: string;
  @Input() circleText: string;
  @Input() actionIcon: string;
  @Input() noAction = false;
  @Input() quantity: number;
  @Input() done: number;
  @Input() noCheckBox = false;
  @Input() checked = false;
  progressUuid = uuidV4();
  @Output() checkedChange = new EventEmitter();
  @Output() action = new EventEmitter();

  toggleCheck() {
    this.checked = !this.checked;
    this.checkedChange.emit({ checked: this.checked, item: this.uuid });
  }

  ngOnChanges() {
    setTimeout(() => {
      $('#progress-' + this.progressUuid.toString()).progress({
        percent: (this.done * 100) / this.quantity,
        showActivity: false
      });
    });
  }

}

import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface CardItem {
  title: string;
  description: string;
}
@Component({
  selector: 'rhea-card',
  templateUrl: './rhea-card.component.html',
  styleUrls: ['./rhea-card.component.scss']
})
export class RheaCardComponent {

  @Input() uuid: string;
  @Input() title: string;
  @Input() description: string;
  @Input() additionalText: string;
  @Input() circleText: string;
  @Input() actionIcon: string;
  @Input() noAction = false;
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter();
  @Output() action = new EventEmitter();

  toggleCheck() {
    this.checked = !this.checked;
    this.checkedChange.emit({ checked: this.checked, item: this.uuid });
  }

}

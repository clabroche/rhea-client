import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rhea-bar-bottom',
  templateUrl: './rhea-bar-bottom.component.html',
  styleUrls: ['./rhea-bar-bottom.component.scss']
})
export class RheaBarBottomComponent implements OnInit {
  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}

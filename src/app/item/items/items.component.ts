import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { CommonService } from '../../providers/common.service';
import { CltPopupComponent } from 'ngx-callisto/dist';
import * as sort from "fast-sort";
@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy {
  items = [];
  timer;
  @ViewChild('deletePopup') deletePopup: CltPopupComponent;
  
  constructor(
    private graphql: GraphQLService,
    private common: CommonService
  ) { }

  ngOnInit() {
    setTimeout(() => this.common.routeName = 'Items');
    this.timer = setInterval(() => {
      this.getAllItems();
    }, this.common.refreshInterval);
    this.getAllItems();
  }

  ngOnDestroy() {
    clearInterval(this.timer)
  }
 
  async getAllItems () {
    let {items} = await this.graphql.query(`items { uuid, name, description }`);
    if(!items) return;
    sort(items).asc('name');
    this.items = this.common.merge(this.items, items);
    console.log(this.items)
  }

  async deleteItem(uuid) {
    this.deletePopup.open().subscribe(result=>{
      if(!result) return;
      this.graphql.mutation(`itemDelete(uuid: "${uuid}")`)
        .then(_=>this.getAllItems())
    })
  }
}

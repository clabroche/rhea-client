import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../providers/common.service';
import { ActivatedRoute } from '@angular/router';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {
  sub;
  uuid: number;
  item;
  timer;
  itemForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private graphql: GraphQLService,
    private common: CommonService,
    private fb: FormBuilder
  ) {
    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
    });
  }

  ngOnInit() {
    this.initForms();
    setTimeout(() => this.common.routeName = 'Item');
    this.timer = setInterval(() => {      
      this.getItem();
    }, this.common.refreshInterval);
    this.getItem().then(_=>{
      this.itemForm.patchValue(this.item)
    });
  }

  initForms() {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['']
    })
  }
  async getItem() {
    const item = await this.graphql.query(`itemById(uuid: "${this.uuid}") { 
      name, description, uuid , price
    }`).then(({ itemById })=> itemById);
    if(!item) return;
    this.item = this.common.merge(this.item, item);
    this.common.routeName = this.item.name
  }
  async updateItem() {
    await this.graphql.mutation(`
      itemUpdate(
        uuid: "${this.uuid}",
        input:${this.graphql.stringifyWithoutPropertiesQuote(this.itemForm.value)}
      ) { uuid }
    `)
    return this.getItem();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.timer);
  }
}

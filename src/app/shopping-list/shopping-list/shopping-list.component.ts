import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CltPopupComponent } from 'ngx-callisto/dist';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../providers/common.service';

@Component({
  selector: 'shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingList;
  uuid;
  addItemForm: FormGroup;
  sub;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  constructor(
    private fb: FormBuilder,
    private graphql: GraphQLService,
    private route: ActivatedRoute,
    private common: CommonService
  ) {
    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
      this.getAllItems();
    });
  }

  ngOnInit() {
    this.initForms();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  initForms() {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [1, Validators.required]
    });
  }

  async getAllItems() {
    const shoppingList = await this.graphql.query(`
      shoppingListById(uuid: "${this.uuid}") {
        uuid, name
        items {
          uuid, name, description, quantity, done
        }
      }
    `).then(({ shoppingListById }) => shoppingListById);
    this.common.routeName = shoppingList.name;
    if (!shoppingList) return;
    this.shoppingList = shoppingList;
  }

  addItem() {
    this.addPopup.bindForm(this.addItemForm).open().subscribe(async result => {
      this.initForms();
      if (!result) return;
      result = await this.graphql.mutation(`
        shoppingListAddItem(listUuid:"${this.uuid}", input:${this.graphql.stringifyWithoutPropertiesQuote(result)}) {
          uuid
        }
      `);
      await this.getAllItems();
    });
  }

  doneIncrement(item) {
    this.graphql.mutation(`
      shoppingListAddItem(listUuid: "${this.uuid}", input: ${this.graphql.stringifyWithoutPropertiesQuote({
        name: item.name, done: item.done + 1, quantity: item.quantity
      })}) {
        uuid
      }`).then(_ => this.getAllItems());
  }
}

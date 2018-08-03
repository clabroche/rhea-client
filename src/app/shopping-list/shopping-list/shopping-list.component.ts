import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CltPopupComponent, CltCommonService, CltSidePanelComponent } from 'ngx-callisto/dist';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../providers/common.service';
import { merge as _merge } from 'lodash';

@Component({
  selector: 'shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingList;
  items;
  uuid;
  addItemForm: FormGroup;
  sub;
  timer;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('deletePopup') deletePopup: CltPopupComponent;
  @ViewChild('actionMenu') actionMenu: CltSidePanelComponent;
  constructor(
    private fb: FormBuilder,
    private graphql: GraphQLService,
    private route: ActivatedRoute,
    private common: CommonService,
    private cltcommon: CltCommonService
  ) {
    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
    });
  }

  ngOnInit() {
    this.initForms();
    this.timer = setInterval(_ => {
      Promise.all([
        this.getShoppingList(),
        this.getAllItems(),
      ]);
    }, this.common.refreshInterval);
    Promise.all([
      this.getShoppingList(),
      this.getAllItems(),
    ]);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.timer);
  }
  initForms() {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [1, Validators.required]
    });
  }
  async getAllItems() {
    const items = await this.graphql.query(`
      items { name }
    `).then((data) => data.items);
    if (!items) return;
    if (!this.items) return this.items = items;
    if (!this.cltcommon.equalityObjects(items, this.items)) this.items = items;
  }

  async getShoppingList() {
    const shoppingList = await this.graphql.query(`
      shoppingListById(uuid: "${this.uuid}") {
        uuid, name
        items {
          uuid, name, description, quantity, done, price
        }
      }
    `).then(({ shoppingListById }) => shoppingListById);
    this.common.routeName = shoppingList.name;
    this.shoppingList = _merge(this.shoppingList, shoppingList)
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
      await this.getShoppingList();
      return this.getAllItems();
    });
  }

  doneIncrement(item, checkedStatus) {
    const i = this.shoppingList.items.indexOf(item);
    if (checkedStatus && checkedStatus.checked) item.done = item.quantity - 1;
    if (item.quantity)
    this.graphql.mutation(`
      shoppingListAddItem(listUuid: "${this.uuid}", input: ${this.graphql.stringifyWithoutPropertiesQuote({
        name: item.name, done: item.done + 1, quantity: item.quantity
      })}) {
        done
      }`).then(({ shoppingListAddItem }) => {
        this.shoppingList.items[i].done = shoppingListAddItem.done;
      });
  }


  openActionMenu(event) {
    const i = this.shoppingList.items.indexOf(event);
    this.actionMenu.title = event.name;
    this.actionMenu.open(event);
  }

  updateItem(item) {
    this.actionMenu.close();
    this.addItemForm.patchValue(item);
    this.addPopup.bindForm(this.addItemForm).open(item).subscribe(result => {
      if (!result) return;
      result.done = item.done;
      this.graphql.mutation(`
        shoppingListAddItem(listUuid:"${this.uuid}", input:${this.graphql.stringifyWithoutPropertiesQuote(result)}) {
          uuid
        }
      `).then(_ => {
          return this.getShoppingList();
        });
    });
  }
  deleteItem(item) {
    this.actionMenu.close();
    this.deletePopup.open().subscribe(result => {
      if (!result) return;
      return this.graphql.mutation(`
        shoppingListRemoveItem(listUuid: "${this.uuid}", itemUuid: "${item.uuid}")
      `).then(_ => this.getShoppingList());
    });
  }
}

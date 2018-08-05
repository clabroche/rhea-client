import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CltPopupComponent, CltCommonService, CltSidePanelComponent } from 'ngx-callisto/dist';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../providers/common.service';
import * as sort from "fast-sort";
import { preserveWhitespacesDefault } from '@angular/compiler';
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
  categories = [];
  sortCategoryObject;
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
    let items = await this.graphql.query(`
      items { name, description, price}
    `).then((data) => data.items);
    if (!items) return;
    items = sort(items).desc('name')
    if (!this.items) return this.items = items;
    this.items = this.common.merge(this.items, items);
  }

  async getShoppingList() {
    const shoppingList = await this.graphql.query(`
    shoppingListById(uuid: "${this.uuid}") {
      uuid, name
      items {
        uuid, name, description, quantity, done, price, 
        category { name }
      }
    }
    `).then(({ shoppingListById }) => shoppingListById);
    if(!shoppingList) return;
    this.shoppingList = this.common.merge(this.shoppingList, shoppingList);
    this.common.routeName = shoppingList.name;
    const sortCategoryObject = {}
    this.categories = []
    if(shoppingList.items) {
      shoppingList.items.map(item=>{
        if(item.category) {
          if (!sortCategoryObject[item.category.name]) {
            sortCategoryObject[item.category.name] = []
            this.categories.push(item.category.name)
          }
          sortCategoryObject[item.category.name].push(item);
        }
        else {
          if (!sortCategoryObject['other']) {
            sortCategoryObject['other'] = []
            this.categories.push('other')
          }
          sortCategoryObject['other'].push(item);
        }
      })
    }
    if (this.sortCategoryObject && Object.keys(sortCategoryObject).length !== Object.keys(this.sortCategoryObject).length) {
      this.sortCategoryObject = sortCategoryObject
    } else {
      this.sortCategoryObject = this.common.merge(this.sortCategoryObject, sortCategoryObject);
    }
    this.categories = Object.keys(this.sortCategoryObject)
  }

  addItem() {
    const title="Ajout d'un item dans la liste";
    this.addItemForm.controls['name'].enable()
    this.initForms()
    this.addPopup.bindForm(this.addItemForm).open({title}).subscribe(async result => {
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
    if (checkedStatus && checkedStatus.checked) item.done = item.quantity - 1;
    if (item.quantity)
    this.graphql.mutation(`
      shoppingListAddItem(listUuid: "${this.uuid}", input: ${this.graphql.stringifyWithoutPropertiesQuote({
        name: item.name, done: item.done + 1, quantity: item.quantity
      })}) {
        done
      }`).then(({ shoppingListAddItem }) => {
        return this.getShoppingList()
      });
  }


  openActionMenu(event) {
    this.actionMenu.title = event.name;
    this.actionMenu.open(event);
  }

  updateItem(item) {
    this.actionMenu.close();
    this.initForms()
    this.addItemForm.patchValue(item);
    const title="Mise à jour de l'item";
    this.addItemForm.controls['name'].disable()
    this.addPopup.bindForm(this.addItemForm).open({title}).subscribe(result => {
      if (!result) return;
      this.addItemForm.controls['name'].enable()
      result = this.addItemForm.value
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

  getPrice() {
    return this.categories.map(category => {
      return this.sortCategoryObject[category].reduce((total, item)=>{
        return (item.price * item.quantity) + total
      }, 0)
    },0).reduce((prev, curr)=>curr+prev , 0)
  }
}

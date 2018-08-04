import { Component, OnInit, ViewChild } from '@angular/core';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { CommonService } from '../../providers/common.service';
import { CltSidePanelComponent, CltPopupComponent } from 'ngx-callisto/dist';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  inventory
  sortCategoryObject
  categories = [];
  addItemForm: FormGroup;
  items = []
  @ViewChild('actionMenu') actionMenu: CltSidePanelComponent;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('deletePopup') deletePopup :CltPopupComponent;
  constructor(
    private graphql: GraphQLService,
    private common: CommonService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getInventory()
    this.getAllItems()
    this.initForms()
  }

  initForms() {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      description: [""],
      quantity: [1]
    })
  }

  async getAllItems() {
    const {items} = await this.graphql.query(`
      items {
        name, uuid
      }
    `)
    this.items = this.common.merge(this.items, items)
  }
  async getInventory() {
    const {inventory} = await this.graphql.query(`
      inventory {
        items {
          uuid,name, quantity, description,
          category { name }
        }
      }
    `)

    if (!inventory) return;
    this.inventory = this.common.merge(this.inventory, inventory);
    this.common.routeName = inventory.name;
    const sortCategoryObject = {}
    if (inventory.items) {
      inventory.items.map(item => {
        if (item.category) {
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
    this.sortCategoryObject = this.common.merge(this.sortCategoryObject, sortCategoryObject);
    this.categories = Object.keys(this.sortCategoryObject)
    console.log(this.inventory)
  }

  updateItem(item) {
    this.actionMenu.close();
    this.addItemForm.patchValue(item);
    const title = "Mise à jour de l'item";
    this.addPopup.bindForm(this.addItemForm).open({ title }).subscribe(result => {
      if (!result) return;
      this.graphql.mutation(`
        inventoryAddItem(
          quantity: ${this.addItemForm.value.quantity},
          input: ${this.graphql.stringifyWithoutPropertiesQuote(this.addItemForm.value)}
        ) {uuid}
      `).then(_=>{
        return this.getInventory();
      })
    });
  }

  openActionMenu(event) {
    this.actionMenu.title = event.name;
    this.actionMenu.open(event);
  }

  addItem() {
    this.initForms()
    this.addPopup.bindForm(this.addItemForm).open().subscribe(result=>{
      if(!result) return ;
      this.graphql.mutation(`
        inventoryAddItem(
          quantity: ${this.addItemForm.value.quantity},
          input: ${this.graphql.stringifyWithoutPropertiesQuote(this.addItemForm.value)}
        ) {uuid}
      `).then(_=>{
        return this.getInventory();
      })
    })
  }

  deleteItem(item) {
    this.actionMenu.close();
    this.deletePopup.open().subscribe(result => {
      if (!result) return;
      return this.graphql.mutation(`
        inventoryRemoveItem(itemUuid: "${item.uuid}")
      `).then(_ => this.getInventory());
    });
  }
}

import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltPopupComponent, CltSidePanelComponent } from 'ngx-callisto/dist';
import { CommonService } from '../../providers/common.service';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.scss']
})
export class ShoppingListsComponent implements OnInit {

  shoppingLists = [];
  shoppingListForm: FormGroup;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('deletePopup') deletePopup: CltPopupComponent;
  @ViewChild('actionMenu') actionMenu: CltSidePanelComponent;
  constructor(
    private graphql: GraphQLService,
    private fb: FormBuilder,
    private common: CommonService,
  ) { }

  ngOnInit() {
    setTimeout(() => this.common.routeName = 'Listes de course');
    this.initForms();
    setInterval(_=>{
      this.getAllShoppingList();
    }, this.common.refreshInterval)
    this.getAllShoppingList();
  }
  initForms() {
    this.shoppingListForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }
  resetForms() {
    this.shoppingListForm.reset();
  }
  openActionMenu(event) {
    const i = this.shoppingLists.indexOf(event);
    this.actionMenu.title = event.name;
    this.actionMenu.open(event);
  }

  updateItem(shoppingList) {
    this.actionMenu.close();
    this.shoppingListForm.patchValue(shoppingList);
    this.addPopup.bindForm(this.shoppingListForm).open(shoppingList).subscribe(result => {
      if (!result) return;
      this.graphql.mutation(`
        shoppingListUpdate(uuid:"${shoppingList.uuid}", input: ${this.graphql.stringifyWithoutPropertiesQuote(result)}) {
          uuid
        }
      `).then(_ => {
        return this.getAllShoppingList();
      });
    });
  }
  deleteItem(shoppingList) {
    this.actionMenu.close();
    this.deletePopup.open().subscribe(result => {
      if (!result) return;
      return this.graphql.mutation(`
        shoppingListDelete(uuid: "${shoppingList.uuid}")
      `).then(_ => this.getAllShoppingList());
    });
  }
  getAllShoppingList() {
    this.graphql.query(`
      shoppingLists {
        uuid
        name
        description
        createdAt
        items {
          uuid
          name
          description
        }
      }
    `).then(({ shoppingLists }) => {
      shoppingLists = shoppingLists.map(shoppingList => {
        shoppingList.createdAt = new Date(shoppingList.createdAt);
        return shoppingList;
      });
      if(this.shoppingLists.length > shoppingLists.length) this.shoppingLists = shoppingLists;
      else this.shoppingLists = this.common.merge(this.shoppingLists, shoppingLists);
      return this.shoppingLists;
    });
  }
  addShoppingList() {
    return this.addPopup.bindForm(this.shoppingListForm).open().subscribe(async result => {
      this.resetForms();
      if (!result) return;
      result = this.graphql.stringifyWithoutPropertiesQuote(result);
      await this.graphql.mutation(`
        shoppingListCreate(input: ${result}) {uuid}
      `);
      return this.getAllShoppingList();
    });
  }
}

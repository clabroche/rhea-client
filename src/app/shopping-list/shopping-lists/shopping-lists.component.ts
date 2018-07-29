import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltPopupComponent } from 'ngx-callisto/dist';
import { CommonService } from '../../providers/common.service';

@Component({
  selector: 'shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.scss']
})
export class ShoppingListsComponent implements OnInit {

  shoppingLists = [];
  shoppingListForm: FormGroup;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  constructor(
    private graphql: GraphQLService,
    private fb: FormBuilder,
    private common: CommonService,
  ) { }

  ngOnInit() {
    setTimeout(() => this.common.routeName = 'Listes de course');
    this.initForms();
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
  getAllShoppingList() {
    this.graphql.query(`
      shoppingLists {
        uuid
        name
        description
        items {
          uuid
          name
          description
        }
      }
    `).then(({ shoppingLists }) => {
        this.shoppingLists = shoppingLists;
      });
  }
  addShoppingList() {
    return this.addPopup.bindForm(this.shoppingListForm).open().subscribe(async result => {
      this.resetForms();
      result = this.graphql.stringifyWithoutPropertiesQuote(result);
      const { shoppingListCreate } = await this.graphql.mutation(`
        shoppingListCreate(input: ${result}) {uuid}
      `);
      console.log(shoppingListCreate);
      return this.getAllShoppingList();
    });
  }
}

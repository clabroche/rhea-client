import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CltPopupComponent } from 'ngx-callisto/dist';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
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
        items {
          uuid, name, description, quantity
        }
      }
    `).then(({ shoppingListById }) => shoppingListById);
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

}

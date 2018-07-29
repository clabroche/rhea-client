import { Component, OnInit } from '@angular/core';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';

@Component({
  selector: 'shopping-lists',
  templateUrl: './shopping-lists.component.html',
  styleUrls: ['./shopping-lists.component.scss']
})
export class ShoppingListsComponent implements OnInit {

  shoppingLists = [];

  constructor(private graphql: GraphQLService) { }

  ngOnInit() {
    this.getAllShoppingList();
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

}

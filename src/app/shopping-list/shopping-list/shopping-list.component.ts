import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CltPopupComponent } from 'ngx-callisto/dist';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';

@Component({
  selector: 'shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  items = [];
  addItemForm: FormGroup;
  @ViewChild('addPopup') addPopup: CltPopupComponent
  constructor(
    private fb: FormBuilder,
    private graphql: GraphQLService
  ) { }

  ngOnInit() {
  }
  initForms() {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, Validators.required],
    });
  }

  async getAllItems() {
    const items = await this.graphql.query(``);
    this.items = items;
  }

  addItem() {
    this.addPopup.bindForm(this.addItemForm).open(result=>{
      this.initForms();
      
    })
  }

}

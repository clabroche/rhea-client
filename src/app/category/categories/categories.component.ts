import { Component, OnInit, ViewChild } from '@angular/core';
import { CltPopupComponent, CltSidePanelComponent } from 'ngx-callisto/dist';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { CommonService } from '../../providers/common.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories = [];
  addCategoryForm: FormGroup;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('deletePopup') deletePopup: CltPopupComponent;
  @ViewChild('actionMenu') actionMenu: CltSidePanelComponent;

  constructor(
    private fb: FormBuilder,
    private graphql: GraphQLService,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.initForms()
    setTimeout(() => this.common.routeName = 'Categories');
    this.getCategories();
  }
  initForms() {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  openActionMenu(event) {
    this.actionMenu.title = event.name;
    this.actionMenu.open(event);
  }

  async getCategories() {
    const {categories} = await this.graphql.query(`categories { uuid, name }`)
    if(!categories) return;
    this.categories = this.common.merge(this.categories, categories);
  }
  addCategory() {
    this.actionMenu.close();
    this.addPopup.bindForm(this.addCategoryForm).open().subscribe(result=>{
      if(!result) return;
      this.graphql.mutation(`
        categoryCreate(input: ${this.graphql.stringifyWithoutPropertiesQuote(result)}) {
          uuid, name
        }
      `).then(_=>{
        this.initForms()
        return this.getCategories()
      })
    })
  }

  updateCategory(category) {
    this.actionMenu.close();
    this.addCategoryForm.patchValue(category);
    this.addPopup.bindForm(this.addCategoryForm).open(category).subscribe(result => {
      if (!result) return;
      console.log(result)
      this.graphql.mutation(`
        categoryUpdate(uuid:"${category.uuid}", input:${this.graphql.stringifyWithoutPropertiesQuote(result)}) {
          uuid
        }
      `).then(_ => {
          return this.getCategories();
        });
    });
  }
  deleteCategory(item) {
    this.actionMenu.close();
    this.deletePopup.open().subscribe(result => {
      if (!result) return;
      return this.graphql.mutation(`
        categoryDelete(uuid: "${item.uuid}")
      `).then(_ => this.getCategories());
    });
  }

}

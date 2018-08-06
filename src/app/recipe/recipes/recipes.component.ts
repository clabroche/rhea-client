import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltPopupComponent, CltSidePanelComponent } from 'ngx-callisto/dist';
import { CommonService } from '../../providers/common.service';
import * as sort from 'fast-sort';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit, OnDestroy {
  recipes = [];
  recipeForm: FormGroup;
  timer;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('deletePopup') deletePopup: CltPopupComponent;
  @ViewChild('actionMenu') actionMenu: CltSidePanelComponent;

  constructor(
    private graphql: GraphQLService,
    private fb: FormBuilder,
    private common: CommonService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    setTimeout(() => this.common.routeName = 'Recettes');
    this.initForms();
    this.timer = setInterval(_ => {
      this.getAllShoppingList();
    }, this.common.refreshInterval)
    this.getAllShoppingList();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  initForms() {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }
  resetForms() {
    this.recipeForm.reset();
  }
  openActionMenu(event) {
    this.actionMenu.title = event.name;
    this.actionMenu.open(event);
  }

  getAllShoppingList() {
    this.graphql.query(`
      recipes {
        uuid
        name
        createdAt
        description
      }
    `).then(({ recipes }) => {
        recipes = recipes.map(recipe => {
          recipe.createdAt = new Date(recipe.createdAt);
          return recipe;
        });
        sort(recipes).desc('createdAt')
        if (this.recipes.length > recipes.length) this.recipes = recipes;
        else this.recipes = this.common.merge(this.recipes, recipes);
        return this.recipes;
      });
  }

  updateItem(recipe) {
    this.actionMenu.close();
    this.recipeForm.patchValue(recipe);
    this.addPopup.bindForm(this.recipeForm).open(recipe).subscribe(result => {
      if (!result) return;
      this.graphql.mutation(`
        recipeUpdate(uuid:"${recipe.uuid}", input: ${this.graphql.stringifyWithoutPropertiesQuote(result)}) {
          uuid
        }
      `).then(_ => {
          return this.getAllShoppingList();
        });
    });
  }
  deleteItem(recipe) {
    this.actionMenu.close();
    this.deletePopup.open().subscribe(result => {
      if (!result) return;
      return this.graphql.mutation(`
        recipeDelete(uuid: "${recipe.uuid}")
      `).then(_ => this.getAllShoppingList());
    });
  }

  addShoppingList() {
    return this.addPopup.bindForm(this.recipeForm).open().subscribe(async result => {
      this.resetForms();
      if (!result) return;
      result = this.graphql.stringifyWithoutPropertiesQuote(result);
      await this.graphql.mutation(`
        recipeCreate(input: ${result}) {uuid}
      `);
      return this.getAllShoppingList();
    });
  }

  fetchMarmiton(url) {
      this.graphql.mutation(`
        recipeCreateWithMarmiton(url: "https://www.marmiton.org/recettes/recette_chocolat-des-neiges_18452.aspx") {
          uuid, name, 
          items{
            name,
            quantity
          }
        }
      `).then(data=>{
        console.log(data)
      })
  }
}

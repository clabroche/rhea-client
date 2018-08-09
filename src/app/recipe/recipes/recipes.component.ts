import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltPopupComponent, CltSidePanelComponent } from 'ngx-callisto/dist';
import { CommonService } from '../../providers/common.service';
import * as sort from 'fast-sort';
import * as bluebird from 'bluebird';
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
  @ViewChild('updateRecipePopup') updateRecipePopup: CltPopupComponent;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('deletePopup') deletePopup: CltPopupComponent;
  @ViewChild('actionMenu') actionMenu: CltSidePanelComponent;
  @ViewChild('marmitonForm') marmitonForm;

  constructor(
    private graphql: GraphQLService,
    private fb: FormBuilder,
    private common: CommonService,
    private http: HttpClient,
  ) {
  }

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

  getAllItems() {
    return this.graphql.query(`
      items {
        name
      }
    `).then(({items}) => items)
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
        recipeCreateWithMarmiton(url: "${url}") {
          uuid, 
          name,
          preparation,
          description,
          createdAt,
          img,
          nbPerson,
          time,
          items{
            name,
            quantity
          }
        }
      `).then(async({ recipeCreateWithMarmiton })=>{
        if(!recipeCreateWithMarmiton) return;
        const allItems = await this.getAllItems()
        recipeCreateWithMarmiton.items = recipeCreateWithMarmiton.items.map(marmitonItem=>{
          marmitonItem.associateWith = [
            ...allItems.filter(item=>{
              return marmitonItem.name.toUpperCase().includes(item.name.toUpperCase())
            })
          ]
          return marmitonItem
        })
        this.updateRecipePopup.open(recipeCreateWithMarmiton).subscribe(async data=>{
          let recipeName  = '';
          const obj: any = {}
          for (let i = 0; i < this.marmitonForm.nativeElement.length; i++) {
            const element = this.marmitonForm.nativeElement[i];
            if (!obj[element.name]) 
              obj[element.name] = {}
            if (element.className === "quantity") obj[element.name].quantity = +element.value
            else if (element.className === "name") obj[element.name].name = element.value
            else recipeName =  element.value
          }
          delete obj.recipeName
          const items = []
          Object.keys(obj).map(key => {
            items.push(obj[key])
          })
          recipeCreateWithMarmiton.name = recipeName
          delete recipeCreateWithMarmiton.items
          delete recipeCreateWithMarmiton.createdAt
          delete recipeCreateWithMarmiton.__typename
          delete recipeCreateWithMarmiton.uuid
          let recipeUuid = await this.graphql.mutation(`
            recipeCreate(input: ${this.graphql.stringifyWithoutPropertiesQuote(recipeCreateWithMarmiton)}) {
              uuid
            }
          `)
          recipeUuid = recipeUuid.recipeCreate.uuid
          
          await bluebird.map(items, async item => {
            await this.graphql.mutation(`
              recipeAddItem(
                recipeUuid: "${recipeUuid}", 
                input: ${this.graphql.stringifyWithoutPropertiesQuote(item)}
              ) {
                uuid
              }
            `)
          })
          return this.getAllShoppingList()
        })
      })
  }
  loadValueInInput(ev, name) {
    ev.target.parentElement.parentElement.querySelector('.name').value = name
    console.log()
  }
}

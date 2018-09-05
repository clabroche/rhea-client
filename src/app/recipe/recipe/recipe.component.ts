import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Renderer2, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../providers/common.service';
import { CltCommonService, CltPopupComponent, CltSidePanelComponent } from 'ngx-callisto/dist';
import * as sort from "fast-sort";
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit, OnDestroy, AfterViewInit {
  timer;
  sub;
  uuid;
  allItems = []
  recipe: any = {};
  inventory: any = {};
  addItemForm: FormGroup
  preparation: string;
  editable = false
  @ViewChild('description') description: ElementRef;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('deletePopup') deletePopup: CltPopupComponent;
  @ViewChild('editor') editor: QuillEditorComponent;
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

  ngAfterViewInit() {
    this.toggleEditable(false)
  }
  ngOnInit() {
    this.initForms();
    this.timer = setInterval(_ => {
      this.interval()
    }, this.common.refreshInterval);
    this.interval()
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.timer);
  }
  interval() {
    return Promise.all([
      this.getRecipe(),
      this.getAllItems(),
      this.getInventory(),
    ]).then(_ => this.enough());
  }
  enough() {
    this.recipe.items.map(item=>{
      this.inventory.items.map(inventoryItem=>{
        if(item.uuid === inventoryItem.uuid && inventoryItem.quantity >= item.quantity) item.enough = true;
      })
      return item;
    })
    console.log()
  }

  async getAllItems() {
    let items = await this.graphql.query(`
      items { uuid, name, description, price}
    `).then((data) => data.items);
    if (!items) return;
    items = sort(items).desc('name')
    if (!this.allItems) return this.allItems = items;
    this.allItems = this.common.merge(this.allItems, items);
  }

  async getInventory() {
    let inventory = await this.graphql.query(`
      inventory { 
        items { uuid, name, description, quantity}
      }
    `).then((data) => data.inventory);
    if (!inventory) return;
    inventory = sort(inventory).desc('name')
    if (!this.inventory) return this.inventory = inventory;
    this.inventory = this.common.merge(this.inventory, inventory);
  }

  async getRecipe() {
    const recipe = await this.graphql.query(`
      recipeById(uuid: "${this.uuid}") {
        uuid, name, preparation
        items {
          uuid, name, description, quantity, price, 
          category { name }
        }
      }
      `).then(({ recipeById }) => recipeById);
    this.recipe = this.common.merge(this.recipe, recipe)
    setTimeout(() => this.common.routeName = recipe.name);
    this.preparation = recipe.preparation
  }

  addItem() {
    this.addItemForm.controls['name'].enable()
    this.initForms()
    this.addPopup.bindForm(this.addItemForm).open().subscribe(result => {
      if (!result) return;
      this.graphql.mutation(`
        recipeAddItem(recipeUuid: "${this.uuid}", input:${
        this.graphql.stringifyWithoutPropertiesQuote(result)
        }) { uuid }
      `).then(_ => this.getRecipe())
    })
  }
  removeItem(item) {
    this.initForms()
    this.deletePopup.open().subscribe(result => {
      if (!result) return;
      this.graphql.mutation(`
        recipeRemoveItem(recipeUuid: "${this.uuid}", itemUuid: "${item.uuid}")
      `).then(_ => this.getRecipe())
    })
  }
  updateItem(item) {
    this.initForms()
    this.addItemForm.controls['name'].disable()
    this.addItemForm.patchValue(item)
    this.addPopup.bindForm(this.addItemForm).open().subscribe(result => {
      if (!result) return;
      this.addItemForm.controls['name'].enable()
      result = this.addItemForm.value;
      this.graphql.mutation(`
        recipeAddItem(recipeUuid: "${this.uuid}", input:${
          this.graphql.stringifyWithoutPropertiesQuote(result)
        }) { uuid }
      `).then(_ => this.getRecipe())
    })
  }
  initForms() {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [1, Validators.required]
    });
  }
  saveDescription(preparation) {
    this.graphql.mutation(`
        recipeUpdate(uuid: "${this.uuid}", input:${
          this.graphql.stringifyWithoutPropertiesQuote({
            preparation
          })
        }) { uuid }
      `)
  }
  toggleEditable(editable = !this.editable) {
    this.editable = editable
    const toolbar = this.editor['elementRef'].nativeElement.querySelector('.ql-toolbar')
    if(!this.editable) {
      this.editor['renderer'].setStyle(toolbar, 'display', 'none')
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.interval()
      }, this.common.refreshInterval);
    } else {
      console.log('out')
      clearInterval(this.timer)
      this.editor['renderer'].setStyle(toolbar, 'display', 'block')
    }
  }
}

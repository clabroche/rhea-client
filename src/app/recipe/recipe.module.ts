import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesComponent } from './recipes/recipes.component';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { RouterModule } from '@angular/router';
import { CltOverlayModule, CltContainersModule } from 'ngx-callisto/dist';
import { RecipeComponent } from './recipe/recipe.component';
import { NgxEditorModule } from 'ngx-editor';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    CltOverlayModule,
    CltContainersModule,
    NgxEditorModule,
    QuillModule,
    RouterModule.forChild([
      { path: '', component: RecipesComponent },
      { path: ':uuid', component: RecipeComponent }
    ])
  ],
  declarations: [RecipesComponent, RecipeComponent]
})
export class RecipeModule { }

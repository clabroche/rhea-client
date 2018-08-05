import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesComponent } from './recipes/recipes.component';
import { RheaSdkModule } from '../rhea-sdk/rhea-sdk.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RheaSdkModule,
    RouterModule.forChild([
      {path: '', component: RecipesComponent}
    ])
  ],
  declarations: [RecipesComponent]
})
export class RecipeModule { }

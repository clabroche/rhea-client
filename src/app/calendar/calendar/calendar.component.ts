import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../providers/common.service';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltPopupComponent } from 'ngx-callisto/dist';
import * as moment from 'moment'
@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  recipes = []
  calendar: any = {}
  events:any = []
  fr = {
    firstDayOfWeek: 1,
    dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
    monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthNamesShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec"],
    today: "Aujourd'hui",
    clear: "Effacer"
  }
  addRecipeForm: FormGroup;
  @ViewChild('addPopup') addPopup: CltPopupComponent;
  @ViewChild('eventPopup') eventPopup: CltPopupComponent;

  constructor(
    private common: CommonService,
    private graphql: GraphQLService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    setTimeout(() => this.common.routeName = "Calendrier");
    this.getAllRecipes()
    this.getCalendar()
    this.initForms()
  }
  getAllRecipes() {
    this.graphql.query(`
      recipes {
        uuid, name
      }
    `).then(({ recipes }) => {
        if (!recipes) return
        this.recipes = recipes
      })
  }
  getCalendar() {
    this.graphql.query(`
      calendar {
        uuid,
        recipes {
          uuid, name, date  
        }
      }
    `).then(({ calendar }) => {
        if (!calendar) return
        this.calendar = calendar
        this.events = this.calendar.recipes.map(recipe=>{
          return {
            recipe,
            title: recipe.name,
            start: recipe.date
          }
        })
      })
  }
  initForms() {
    this.addRecipeForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      moment: ['', Validators.required],
    })
  }


  addRecipe() {
    this.initForms()
    const title = "Ajout d'un item";
    this.addPopup.bindForm(this.addRecipeForm).open({ title }).subscribe(result => {
      if (!result) return;
      const uuid = this.recipes.filter(recipe=> recipe.name === result.name).pop().uuid
      let date = new Date(result.date)
      console.log(result.moment)
      if (result.moment === "midday") date.setHours(14)
      else date.setHours(21)
      this.graphql.mutation(`
        calendarAddRecipe(
          recipeUuid: "${uuid}",
          date: "${date.toISOString()}"
        ) {uuid}
      `).then(_ => {
          return this.getCalendar();
        })
    })
  }

  eventClick($event) {
    this.eventPopup.title = $event.calEvent.recipe.name
    this.eventPopup.open($event.calEvent.recipe)
  }

  deleteRecipe(recipe) {
    this.eventPopup.close()
    this.graphql.mutation(`
      calendarRemoveRecipe(
        recipeUuid: "${recipe.uuid}",
        date: "${new Date(recipe.date).toISOString()}"
      )
    `).then(_=>this.getCalendar())
  }
}

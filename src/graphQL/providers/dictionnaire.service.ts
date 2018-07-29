import { Injectable } from "@angular/core";

import { User } from "../models/user.model";
import { Structure } from "../models/structure.model";
/**
 * Linker between graphQL and Angular models
 */
@Injectable()
export class DictionnaireService {

  /**
   * key is GraphQL / value is angular Model
   */
  dico:any = {
    user: User,
    users:User,
    structure: Structure
  }

  /**
   * Transform graphQL result into an angular Model.
   * 
   * For instance to add functions on model
   * 
   * @param {String} key GraphQL key  
   * @param {Object} data GraphQL data to inject in model
   */
  load(key,data){
    if(this.dico[key]) {
      if(Array.isArray(data))
        data = data.map(d => new this.dico[key](d))
      else 
        data = new this.dico[key](data)
    }
    return data
  }
}

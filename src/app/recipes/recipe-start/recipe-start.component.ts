import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer'
import * as RecipesActions from '../store/recipes.actions'
import { map, switchMap, take, tap } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
@Component({
  selector: 'app-recipe-start',
  templateUrl: './recipe-start.component.html',
  styleUrls: ['./recipe-start.component.css']
})
export class RecipeStartComponent implements OnInit {

  constructor(private store:Store<fromApp.AppState>,private recipeService:RecipeService) { 
  }

  message:string=null;
  // recipes:Recipe[];

  ngOnInit(): void {
   this.recipeService.recipeList.subscribe(res=>{
    // this.recipes=res
    // console.log(res)
    if(res.length===0){
     this.message="Please Add A Recipe"
    }else{
     this.message="Please Select A Recipe"
    }
   })
  }

}

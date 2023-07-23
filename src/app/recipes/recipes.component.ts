import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer'
import * as RecipesActions from './store/recipes.actions'
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  //providers: [RecipeService]
})
export class RecipesComponent implements OnInit {

  selectedRecipe: Recipe
  constructor(private recipeService: RecipeService,private store: Store<fromApp.AppState> ) {
   }

  ngOnInit(): void {
    // this.recipeService.recipeSelected
    // .subscribe(
    //   (recipe:Recipe)=>{
    //     this.selectedRecipe=recipe;
    //   }
    // )
    this.store.dispatch(new RecipesActions.FetchRecipes());

    
  }

}

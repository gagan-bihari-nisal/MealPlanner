import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store';
import * as RecipesActions from '../store/recipes.actions'
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions'
import { map, switchMap } from 'rxjs';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;
  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params
    .pipe(
      map((params: Params) => +params['id']),
      switchMap((id: number) => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map((recipeState) =>
        recipeState.recipes.find((recipe, index: number) => index === this.id)
      )
    )
    .subscribe((recipe: Recipe) => (this.recipe = recipe));
  }
  onAddToShoppingList() {
    //this.recipeService.addIngredientsToSl(this.recipe.ingredients)
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {
      relativeTo: this.route
    })
  }

  onDeleteRecipe() {
   // this.recipeService.deleteRecipe(this.id);
   this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['/recipes'])
  }

}

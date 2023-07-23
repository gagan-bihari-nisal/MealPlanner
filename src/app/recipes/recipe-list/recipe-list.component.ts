import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router'
import { BehaviorSubject, Subscription, map } from 'rxjs';
import * as fromApp from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  // @Output() recipeWasSelected=new EventEmitter<Recipe>();

  recipes: Recipe[];
  subscription: Subscription;
  

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private store: Store<fromApp.AppState>) { 
  }

  ngOnInit(): void {
    // this.subscription = this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
    //   this.recipes = recipes
    // })



    this.subscription = this.store.select('recipes')
    .pipe(
      map(recipesState => {
          return recipesState.recipes
        })
      )
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes
        this.recipeService.recipeList.next(this.recipes)
      })
      //this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onNewRecipe() {
    this.router.navigate(['new'], {
      relativeTo: this.route
    })
  }

  // onRecipeSelected(recipe:Recipe){
  //   this.recipeWasSelected.emit(recipe);
  // }

}

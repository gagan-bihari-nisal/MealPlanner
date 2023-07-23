import { EventEmitter } from "@angular/core"
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { Injectable } from "@angular/core";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { BehaviorSubject, Subject } from "rxjs";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from "src/app/shopping-list/store/shopping-list.actions";
import * as fromShoppingList from 'src/app/shopping-list/store/shopping-list.reducer' 
import * as fromApp from '../store/app.reducer'

@Injectable()
export class RecipeService {

    // recipeSelected = new Subject<Recipe>();

    recipeChanged = new Subject<Recipe[]>();


    recipeList=new BehaviorSubject<Recipe[]>([]);


    // private recipes: Recipe[] = [
    //     new Recipe("recipe 1", "recipe1 desc", "https://cdn.pixabay.com/photo/2017/03/17/10/29/breakfast-2151201__480.jpg", [
    //         new Ingredient('Meat', 1),
    //         new Ingredient('Cheese', 3)
    //     ]),
    //     new Recipe("recipe 2", "recipe2 desc", "https://cdn.pixabay.com/photo/2018/08/30/10/22/plum-cake-3641833__480.jpg", [
    //         new Ingredient('Buns', 1),
    //         new Ingredient('Fries', 3)
    //     ]),
    //     new Recipe("recipe 3", "recipe3  desc", "https://cdn.pixabay.com/photo/2017/11/16/18/51/kagyana-2955466__480.jpg", [
    //         new Ingredient('Meat', 1),
    //         new Ingredient('Cheese', 3)
    //     ])
    // ];
    private recipes: Recipe[] = [];

    constructor( private store: Store<fromApp.AppState>) {}

    getRecipes() {
        return this.recipes.slice();
    }


    getRecipe(index: number) {
        return this.recipes[index];
    }

    setRecipes(recipe: Recipe[]) {
        this.recipes = recipe;
        this.recipeChanged.next(this.recipes.slice())
    }

    addIngredientsToSl(ingredients: Ingredient[]) {
        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice())
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice())
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice())
    }
}
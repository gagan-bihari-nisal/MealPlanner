import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import * as fromApp from 'src/app/store/app.reducer'
import * as RecipesActions from '../recipes/store/recipes.actions'
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from './ingredient.model';
@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService,private store:Store<fromApp.AppState>,private shoppingListService:ShoppingListService) { }

  // storedRecipe() {
  //   const recipes = this.recipeService.getRecipes();
  //   this.http.put(environment.databaseUrl, recipes)
  //   .subscribe(response => {
  //  //   console.log(response)
  //   })
  // }


  // storeIngredient(ingredients:Ingredient[]){
  //   var id =JSON.parse(localStorage.getItem('userData'))['id'];
  //    this.http.put(environment.databaseUrl+id+'/shopping-list.json',ingredients).subscribe(response=>{
  //     console.log(response);
  //    })
  // }

  // fetchIngredients(){
  //   var id =JSON.parse(localStorage.getItem('userData'))['id'];
  //   return this.http.get<Ingredient[]>(environment.databaseUrl+id+'/shopping-list.json')
  // }


  

  // fetchRecipes() {
  //   //return this.authService.user.pipe(take(1),exhaustMap(user=>{

  //   return this.http.get<Recipe[]>(environment.databaseUrl)
  //     .pipe(map(recipes => {
  //       return recipes.map(recipe => {
  //         return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
  //       })
  //     }), tap(recipes => {
  //    //   this.recipeService.setRecipes(recipes);
  //     this.store.dispatch(new RecipesActions.SetRecipes(recipes))
  //     }))

  // }
}

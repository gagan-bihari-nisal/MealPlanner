import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { Observable, first, map, of, switchMap, take } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import * as RecipesActions from '../recipes/store/recipes.actions'
import * as fromApp from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService, private store: Store<fromApp.AppState>, private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
   // const recipes = this.recipeService.getRecipes();
    // return this.dataStorageService.fetchRecipes();
    //   return this.store.select('recipes').pipe(
    //     take(1),
    //     map(recipesState=>{
    //       return recipesState.recipes
    //     }),
    //     switchMap(recipes=>{
    //       if(recipes.length===0){
    //         this.store.dispatch(new RecipesActions.FetchRecipes())
    //         return this.actions$.pipe(
    //           ofType(RecipesActions.SET_RECIPES),
    //           take(1)
    //          )
    //       }else{
    //         return of(recipes);
    //       }
    //     })
    //    )
    //    this.store.dispatch(new RecipesActions.FetchRecipes())


    // }

    // return this.store.select('recipes').pipe(
    //   take(1),
    //   map(recipesState => recipesState.recipes),
    //   switchMap(recipes => {
    //     console.log("resolve")
    //     if (!recipes.length) {
    //       this.store.dispatch(new RecipesActions.FetchRecipes());
    //       return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
    //     } else {
    //       return of(recipes);
    //     }
    //   })
    // );


   

    return this.store.select('recipes').pipe(
      first(),
      map(recipesState => recipesState.recipes),
      switchMap(recipes => {
        if (!recipes.length) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), first());
        } else {
          return of(recipes );
        }
      })
    );

  }
}

import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from './recipes.actions'
import { map, switchMap, withLatestFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";
import * as fromApp from 'src/app/store/app.reducer'
import { Store } from "@ngrx/store";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
@Injectable()
export class RecipesEffects {

    fetchRecipes = createEffect(
        () => this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                var id =JSON.parse(localStorage.getItem('userData'))['id'];
                return this.http.get<Recipe[]>(environment.databaseUrl+id+'/recipes.json')
            }),
            map(recipes => {
                if(recipes===null){
                    return []
                }
                return recipes.map(recipe => {
                    return {
                        ...recipe,ingredients: recipe.ingredients ? recipe.ingredients : [],
                        procedure: recipe.procedure ? recipe.procedure : []
                    };
                })
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes)
            })
        )
    )


    storeRecipes = createEffect(
        () =>
            this.actions$.pipe(
                ofType(RecipesActions.STORE_RECIPES),
                withLatestFrom(this.store.select('recipes')),
                switchMap(([actionData, recipesState]) => {
                    var id =JSON.parse(localStorage.getItem('userData'))['id'];
                    return this.http.put(environment.databaseUrl+id+'/recipes.json', recipesState.recipes)
                }
                )
            ),
        { dispatch: false }
    );

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {
        
     }
}
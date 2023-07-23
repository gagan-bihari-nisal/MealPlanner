import * as fromShoppingList from 'src/app/shopping-list/store/shopping-list.reducer';
import * as  fromAuth from 'src/app/auth/store/auth.reducer'
import { ActionReducerMap } from '@ngrx/store';
import * as fromRecipes from '../recipes/store/recipes.reducer'
export interface AppState{
    shoppingList:fromShoppingList.State;
    auth:fromAuth.State;
    recipes:fromRecipes.State;
}

export const appReducers:ActionReducerMap<AppState>={
    shoppingList:fromShoppingList.shoppingListReducer,
    auth:fromAuth.authReducer,
    recipes:fromRecipes.recipeReducer
}

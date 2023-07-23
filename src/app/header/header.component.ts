import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription, map } from 'rxjs';
import * as fromApp from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store';
import * as AuthActions from "src/app/auth/store/auth.actions";
import * as RecipesActions from '../recipes/store/recipes.actions'
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'
import { ShoppingListService } from '../shopping-list/shopping-list.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // @Output() featureSelected = new EventEmitter<string>();
  collapsed = true;

  private userSub: Subscription
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>, private shoppingListService: ShoppingListService) { }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {

    this.userSub = this.store.select('auth').pipe(
      map(authState => {
        return authState.user
      })
    ).subscribe(user => {
      this.isAuthenticated = !!user
    });

    // this.userSub = this.authService.user.subscribe(user=>{
    //  this.isAuthenticated=!!user
    // });
  }

  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout())
  }
  onSaveData() {
    //   this.dataStorageService.storedRecipe();
    this.store.dispatch(new RecipesActions.StoreRecipes())
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipesActions.FetchRecipes())
  }

}

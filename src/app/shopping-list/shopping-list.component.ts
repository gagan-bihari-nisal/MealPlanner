import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as fromShoppingList from 'src/app/shopping-list/store/shopping-list.reducer'
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions'
import * as fromApp from '../store/app.reducer'
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

 ingredients: Observable<{ ingredients: Ingredient[] }>;
  //ingredients: Ingredient[]
  //private subsription: Subscription

  constructor(private shoppingListService: ShoppingListService, private logginService: LoggingService, private store: Store<fromApp.AppState>, private dataStorageService: DataStorageService) { }


  ngOnDestroy(): void {
   //  this.subsription.unsubscribe();
  }

  ngOnInit(): void {
     this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }



}

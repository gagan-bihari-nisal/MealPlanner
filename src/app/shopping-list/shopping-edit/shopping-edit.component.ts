import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from "src/app/shopping-list/store/shopping-list.actions";
import * as fromShoppingList from 'src/app/shopping-list/store/shopping-list.reducer'
import * as fromApp from 'src/app/store/app.reducer'
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  // @ViewChild("nameInput") nameInputRef : ElementRef;
  // @ViewChild("amountInput") amountInputRef : ElementRef;

  //@Output() ingredientAdded=new EventEmitter<Ingredient>();
  subsription: Subscription;
  editMode = false;
  // editedItemIndex: number;
  editedItem: Ingredient;
  @ViewChild("f") slForm: NgForm;

  ingredients: Ingredient[]

  constructor(private shoppingListService: ShoppingListService, private store: Store<fromApp.AppState>, private dataStorageService: DataStorageService) { }



  ngOnDestroy(): void {
    this.subsription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit())

  }

  ngOnInit(): void {

    this.subsription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false
      }
    })

    // this.subsription = this.shoppingListService.startedEditing.subscribe((index: number) => {
    //   this.editMode = true;
    //   this.editedItemIndex = index;
    //   this.editedItem = this.shoppingListService.getIngredient(index);
    //   this.slForm.setValue({
    //     name: this.editedItem.name,
    //     amount: this.editedItem.amount
    //   })
    // })
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode){
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
      // this.store.select('shoppingList').subscribe((data) => {
      //   this.ingredients = data.ingredients
      // })
      // this.dataStorageService.storeIngredient(this.ingredients);
    }
    else {
      //  this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
      // this.store.select('shoppingList').subscribe((data) => {
      //   this.ingredients = data.ingredients
      // })
      // this.dataStorageService.storeIngredient(this.ingredients);

    }

    this.editMode = false;
    form.reset()
    // const name=this.nameInputRef.nativeElement.value;
    // const amount=this.amountInputRef.nativeElement.value;

    // const newIngredient=new Ingredient(name,amount);
    // this.ingredientAdded.emit(newIngredient);
    // this.shoppingListService.addIngredient(newIngredient);
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  onDelete() {
    //  this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear();
  }

}

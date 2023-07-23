import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import * as fromApp from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import * as RecipesActions from '../store/recipes.actions'
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router, private store: Store<fromApp.AppState>, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    })
  }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }

  private initForm() {



    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    let recipeProcedure = new FormArray([]);
    if (this.editMode) {
      //  const recipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store.select('recipes').pipe(
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id
          })
        })
      ).subscribe(recipe => {

        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe.ingredients) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            )
          }
        }
        if (recipe.procedure) {
          for (let steps of recipe.procedure) {
            recipeProcedure.push(
              new FormGroup({
                'steps': new FormControl(steps.steps, Validators.required),
              })
            )
          }
        }
      })
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients,
      'procedure': recipeProcedure
    })
  }

  onSubmit() {
    // const newRecipe = new Recipe(this.recipeForm.value['name'], this.recipeForm.value['description'], this.recipeForm.value['imagePath'], this.recipeForm.value['ingredients']);
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(new RecipesActions.UpdateRecipe({
        index: this.id,
        newRecipe: this.recipeForm.value
      }))
    } else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    }));
  }


  onAddProcedure() {
    (<FormArray>this.recipeForm.get('procedure')).push(new FormGroup({
      'steps': new FormControl(null, Validators.required),
    }));
  }

  get controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  get procedureControls() {
    return (this.recipeForm.get('procedure') as FormArray).controls;
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onDeleteProcedure(index: number) {
    (<FormArray>this.recipeForm.get('procedure')).removeAt(index);
  }
}

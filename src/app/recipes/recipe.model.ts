import { Ingredient } from "../shared/ingredient.model";
import { Procedure } from "../shared/procedure.model";

export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];
    public procedure:Procedure[];
    

    constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[], procedure:Procedure[]) {
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
        this.procedure=procedure

    }

}
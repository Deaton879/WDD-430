import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
    
    private recipes: Recipe[] = [
        new Recipe('Tasty Schnitzel', 
                   'This is simply a test.', 
                   'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.g_WpteVluMseFNVzp3c_KQHaLH%26pid%3DApi&f=1',
                   [
                       new Ingredient('Meat', 1),
                       new Ingredient('French Fries', 20)
                   ]),
        new Recipe('Big Fat Burger',
                   'Another test recipe test.',
                   'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.g_WpteVluMseFNVzp3c_KQHaLH%26pid%3DApi&f=1',
                   [
                       new Ingredient('Buns', 2),
                       new Ingredient('Meat', 1)
                   ])
    ];

    constructor(private slService: ShoppingListService){}

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
}
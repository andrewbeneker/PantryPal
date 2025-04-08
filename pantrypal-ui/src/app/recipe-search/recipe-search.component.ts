import { Component } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-recipe-search',
  imports: [FormsModule,CommonModule],
  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css'
})
export class RecipeSearchComponent {
  query: string = '';
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipesService){}

  search() {
    if (this.query.trim()) {
      this.recipeService.searchRecipes(this.query).subscribe(response => {
        this.recipes = response.map((recipe: any) => ({
          label: recipe.recipeLabel,
          image: recipe.recipeImage,
          url: recipe.recipeUrl
        }));
      });
    }
  }
}
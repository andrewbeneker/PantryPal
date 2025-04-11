import { Component } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe';
import { Favorite } from '../models/favorite';
import { FavoriteService } from '../services/favorite.service';
import { FavoritesComponent } from '../favorites/favorites.component';

@Component({
  selector: 'app-recipe-search',
  imports: [FormsModule,CommonModule],
  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css'
})
export class RecipeSearchComponent {
  query: string = '';
  recipes: Recipe[] = [];
  

  constructor(private recipeService: RecipesService, private favoriteService: FavoriteService){}

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

  createFavorite(recipe: Recipe){

   const favoriteRecipe: Favorite = {
      recipeName: recipe.label,
      recipeUrl: recipe.url,
      recipeImage: recipe.image
    }

    this.favoriteService.createFavorite(favoriteRecipe).subscribe(data => {})
  }
}
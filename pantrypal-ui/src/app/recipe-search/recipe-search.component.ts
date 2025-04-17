import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe';
import { Favorite } from '../models/favorite';
import { FavoriteService } from '../services/favorite.service';
import { FavoritesComponent } from '../favorites/favorites.component';
import { Pantryitem } from '../models/pantryitem';
import { PantryitemService } from '../services/pantryitem.service';

@Component({
  selector: 'app-recipe-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css'
})
export class RecipeSearchComponent implements OnInit {
  query: string = '';
  recipes: Recipe[] = [];
  favorites: Favorite[] = [];
  pantryItems: Pantryitem[] = [];
  constructor(private recipeService: RecipesService, private favoriteService: FavoriteService,  private pantryItemService: PantryitemService) { }

  ngOnInit(): void {
    this.loadFavorites();
    this.loadPantryItems();

  }
  loadPantryItems(): void {
    this.pantryItemService.getPantryItems().subscribe(items => {
      this.pantryItems = items as Pantryitem[];
    });
  }
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
  
  createFavorite(recipe: Recipe) {

    const favoriteRecipe: Favorite = {
      recipeName: recipe.label,
      recipeUrl: recipe.url,
      recipeImage: recipe.image
    }

    this.favoriteService.createFavorite(favoriteRecipe).subscribe(data => { 
      alert('Favorite recipe added!')
      this.loadFavorites(); // refreshes current favorites after creating a new favorite
    });
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe(data => {
      this.favorites = data;
    });
  }

  isFavorite(recipe: Recipe): boolean {
    return this.favorites.some(fav => fav.recipeUrl === recipe.url);
  }
}
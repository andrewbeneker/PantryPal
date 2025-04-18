import { Component, OnInit } from '@angular/core';
import { PantryitemService } from '../services/pantryitem.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { FavoriteService } from '../services/favorite.service';
import { Favorite } from '../models/favorite';
import { Recipe } from '../models/recipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recommended-recipes',
  imports: [CommonModule],
  templateUrl: './recommended-recipes.component.html',
  styleUrl: './recommended-recipes.component.css'
})
export class RecommendedRecipesComponent implements OnInit {
  recipes: any[] = [];
  showResetButton = !environment.production;
  favorites: Favorite[] = [];

  constructor(private pantryItemService: PantryitemService, private favoriteService: FavoriteService) { }

  ngOnInit(): void {
    this.fetchRecommendedRecipes();
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe(data => {
      console.log('Favorites from API:', data);
      this.favorites = data as any[];
    })
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

    isFavorite(recipe: Recipe): boolean {
      return this.favorites.some(fav => fav.recipeUrl === recipe.url);
    }

  deleteFavorite(favoriteId: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.favoriteService.deleteFavorite(favoriteId).subscribe(() => {
        this.favorites = this.favorites.filter(item => item.favoriteId !== favoriteId);
        this.loadFavorites();
      });
    }
  }

  fetchRecommendedRecipes(): void {
    const pantryRaw = localStorage.getItem('pantryItems');
    const snapshotRaw = localStorage.getItem('pantrySnapshot');
    const cachedRaw = localStorage.getItem('cachedRecipes');


    if (!pantryRaw) {
      console.warn('🚫 No pantry items found in local storage.');
      return;
    }

    const pantryItems: any[] = JSON.parse(pantryRaw);
    const snapshot: any[] = snapshotRaw ? JSON.parse(snapshotRaw) : null;
    const pantryChanged = JSON.stringify(pantryItems) !== JSON.stringify(snapshot);

    if (!pantryChanged && cachedRaw) {
      console.log('⚡ Using cached recommended recipes.');
      this.recipes = JSON.parse(cachedRaw);
      return;
    }

    const ingredients = pantryItems.map(i => i.itemName);
    console.log('🌟 Fetching new recipes for:', ingredients);

    this.pantryItemService.getRecipesFromPantry(ingredients).subscribe({
      next: (rawResponse: any[]) => {
        this.recipes = rawResponse.map((recipe: any) => ({
          label: recipe.title,
          image: recipe.image,
          url: `https://spoonacular.com/recipes/${recipe.title?.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`
        }));

        // ✅ Save new snapshot and recipes to localStorage
        localStorage.setItem('cachedRecipes', JSON.stringify(this.recipes));
        localStorage.setItem('pantrySnapshot', JSON.stringify(pantryItems));

        console.log('✅ New recommended recipes loaded and cached');
      },
      error: (error) => {
        console.error('❌ Error fetching recommended recipes:', error);
      }
    });
  }

  resetRecommendations(): void {
    localStorage.removeItem('pantrySnapshot');
    localStorage.removeItem('recommendedRecipes');
    this.fetchRecommendedRecipes(); // Re-fetch using latest pantry
  }
}
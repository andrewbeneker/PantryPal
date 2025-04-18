import { Component, OnInit } from '@angular/core';
import { PantryitemService } from '../services/pantryitem.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recommended-recipes',
  imports: [CommonModule],
  templateUrl: './recommended-recipes.component.html',
  styleUrl: './recommended-recipes.component.css'
})
export class RecommendedRecipesComponent implements OnInit {
  recipes: any[] = [];
  showResetButton = !environment.production;
  
  constructor(private pantryItemService: PantryitemService) {}

  ngOnInit(): void {
    this.fetchRecommendedRecipes();
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

  recommendBasedOnExpiring(): void {
    const pantryRaw = localStorage.getItem('pantryItems');
    if (!pantryRaw) {
      console.warn('No pantry items found in local storage.');
      return;
    }
  
    const pantryItems: any[] = JSON.parse(pantryRaw);
  
    // Filter items expiring soon using your existing utility
    const expiringItems = pantryItems.filter(item => this.isItemExpiringSoon(item.expirationDate));
  
    if (expiringItems.length === 0) {
      console.info('📦 No pantry items are expiring soon.');
      this.recipes = [];
      return;
    }
  
    const expiringIngredientNames = expiringItems.map(item => item.itemName);
    console.log('⏳ Fetching recipes for expiring items:', expiringIngredientNames);
  
    this.pantryItemService.getRecipesFromPantry(expiringIngredientNames).subscribe({
      next: (rawResponse: any[]) => {
        this.recipes = rawResponse.map((recipe: any) => ({
          label: recipe.title,
          image: recipe.image,
          url: `https://spoonacular.com/recipes/${recipe.title?.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`
        }));
  
        // Optionally cache them separately
        localStorage.setItem('cachedExpiringRecipes', JSON.stringify(this.recipes));
        console.log('✅ Recipes for expiring items loaded and cached');
      },
      error: (error) => {
        console.error('❌ Error fetching recipes for expiring items:', error);
      }
    });
  }

  isItemExpiringSoon(date: Date | string): boolean {
    return this.pantryItemService.isExpiringSoon(date);
  }
}
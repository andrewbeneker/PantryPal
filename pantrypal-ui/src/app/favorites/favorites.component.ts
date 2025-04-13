import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { RouterLink, RouterModule } from '@angular/router';
import { Favorite } from '../models/favorite';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {

constructor(private favoriteService: FavoriteService){}
 
favorites: Favorite [] = []; // changed from array of type any to array of type favorite to enable type-checking

ngOnInit(){
  this.loadFavorites();
}

loadFavorites(): void {
  this.favoriteService.getFavorites().subscribe(data => {
    console.log('Favorites from API:', data);
    this.favorites = data as any[];
  })
}

deleteFavorite(favoriteId: number): void {
  if (confirm('Are you sure you want to delete this item?')) {
    this.favoriteService.deleteFavorite(favoriteId).subscribe(() => {
      this.favorites = this.favorites.filter(item => item.favoriteId !== favoriteId);
      this.loadFavorites();
    });
  }
}}

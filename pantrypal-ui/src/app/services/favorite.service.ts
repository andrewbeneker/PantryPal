import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Favorite } from '../models/favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private favoriteUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) { }

  getFavorites() {
    return this.http.get(`${this.favoriteUrl}`)
  }

  createFavorite(favorite: Favorite) {
    return this.http.post(`${this.favoriteUrl}`, favorite)
  }

  deleteFavorite(favoriteId: number){
    return this.http.delete(`${this.favoriteUrl}/${favoriteId}`)
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Favorite } from '../models/favorite';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private favoriteUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) { }

  // Specify return an observable favorite rather than observable any to enable type checking - prior to was causing an issue due to favorite model having favoriteId as an optional property
  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.favoriteUrl}`);
  }

  createFavorite(favorite: Favorite) {
    return this.http.post(`${this.favoriteUrl}`, favorite);
  }

  deleteFavorite(favoriteId: number) {
    return this.http.delete(`${this.favoriteUrl}/${favoriteId}`);
  }
}
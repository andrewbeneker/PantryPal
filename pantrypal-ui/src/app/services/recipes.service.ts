import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private recipesUrl = 'https://localhost:7286/api/Recipes/';
  constructor(private http: HttpClient) { }

  getRecipes(){
    return this.http.get(`${this.recipesUrl}`)
  }
}

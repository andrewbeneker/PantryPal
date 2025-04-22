import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private apiUrl = `${environment.apiUrl}/recipes`;

  constructor(private http: HttpClient) { }

  searchRecipes(query: string, limit: number = 5): Observable<any> {
    const encodedQuery = encodeURIComponent(query); // encodes query string
    const url = `${this.apiUrl}/search?query=${encodedQuery}&limit=${limit}`; // builds URL with inserted encoded query
    return this.http.get(url);
  }

}

import { Injectable } from '@angular/core';
import { Foodstats } from '../models/foodstats';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodstatsService {

  private apiUrl = `${environment.apiUrl}/FoodWasteStats`;

  constructor(private http: HttpClient) { }

  getStats(): Observable<Foodstats> {
    return this.http.get<Foodstats>(`${this.apiUrl}`);
  }

  addItemsUsed() {
    return this.http.post(`${this.apiUrl}/ItemsUsed`, {});
  }

  addItemsWasted() {
    return this.http.post(`${this.apiUrl}/ItemsWasted`, {});
  }

}

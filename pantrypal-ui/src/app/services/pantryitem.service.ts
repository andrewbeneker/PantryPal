import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pantryitem } from '../models/pantryitem';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PantryitemService {

  private pantryItemUrl = `${environment.apiUrl}/PantryItems`;
  constructor(private http: HttpClient) { }

  getPantryItems(){
    return this.http.get(`${this.pantryItemUrl}`)
  }
  getSinglePantryItem(pantryId: number){
    return this.http.get(`${this.pantryItemUrl}/${pantryId}`)
  }
  addPantryItem(pantryItem: Pantryitem){
    return this.http.post(`${this.pantryItemUrl}`, pantryItem)
  }

  updatePantryItem(itemId: number, item: Pantryitem){
    return this.http.put(`${this.pantryItemUrl}/${itemId}`, item);
  }

  deletePantryItem(pantryId: number){
    return this.http.delete(`${this.pantryItemUrl}/${pantryId}`)
  }

}

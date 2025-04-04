import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pantryitem } from '../models/pantryitem';

@Injectable({
  providedIn: 'root'
})
export class PantryitemService {

  private pantryItemUrl = 'https://localhost:7286/api/PantryItems'
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
  deletePantryItem(pantryId: number){
    return this.http.delete(`${this.pantryItemUrl}/${pantryId}`)
  }

}

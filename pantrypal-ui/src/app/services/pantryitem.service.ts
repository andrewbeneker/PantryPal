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


  isExpired(date: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    return target < today;
  }
  // Method to check if the item is expiring soon (within 3 days)
  isExpiringSoon(date: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const target = new Date(date);
    const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && diffDays >= 0;
  }

  // Method to calculate days until expiration
  daysUntilExpiration(date: Date | string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset to midnight to avoid time comparison issues
    const target = new Date(date);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays > 1) return `Expires in ${diffDays} days`;
    if (diffDays === -1) return 'Expired yesterday';
    return `Expired ${Math.abs(diffDays)} days ago`;
  }

    getExpirationBadge(date: Date | string): { emoji: string, class: string, text: string } {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      const target = new Date(date);
      target.setHours(0, 0, 0, 0);
    
      const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
      if (diffDays < 0) {
        return { emoji: '🔴', class: 'bg-danger', text: `Expired ${Math.abs(diffDays)} days ago` };
      } else if (diffDays === 0) {
        return { emoji: '🔴', class: 'bg-danger', text: 'Expires today' };
      } else if (diffDays === 1) {
        return { emoji: '🟠', class: 'bg-warning text-dark', text: 'Expires tomorrow' };
      } else if (diffDays <= 3) {
        return { emoji: '🟡', class: 'bg-warning text-dark', text: `Expires in ${diffDays} days` };
      } else {
        return { emoji: '🟢', class: 'bg-success', text: `Expires in ${diffDays} days` };
      }
    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PantryitemService } from '../services/pantryitem.service';
import { Pantryitem } from '../models/pantryitem';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pantryItemCount: number = 0;  // store pantry items
  expiringSoonItems: Pantryitem[] = [];  // store expiring soon items
  username: string | null = null;
  today: Date = new Date();

  constructor(
    private router: Router,
    private pantryService: PantryitemService,
  ) {}

  ngOnInit(): void {
    this.loadPantryItems();
    this.username = this.getUsernameFromToken();
  }

  loadPantryItems(): void {
    this.pantryService.getPantryItems().subscribe((items: any) => {
      const pantryItems = items as Pantryitem[];
      this.pantryItemCount = pantryItems.length;

      this.expiringSoonItems = pantryItems
        .filter(item => this.isExpiringSoon(item.expirationDate))
        .sort((a, b) =>
          new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
        )
        .slice(0, 5);  // gets top 5 expiring items
    });
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.username || null;
    } catch {
      return null;
    }
  }
  

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
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
}

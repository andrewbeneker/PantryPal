import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PantryitemService } from '../services/pantryitem.service';
import { Pantryitem } from '../models/pantryitem';
import { UserService } from '../services/user.service';
import { FoodstatsService } from '../services/foodstats.service';
import { Foodstats } from '../models/foodstats';

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
  stats: Foodstats = { itemsUsed: 0, itemsWasted: 0 }

  constructor(
    private router: Router,
    private pantryService: PantryitemService,
    private userService: UserService,
    private foodStatsService: FoodstatsService
  ) { }

  ngOnInit(): void {
    this.loadPantryItems();
    const name = this.userService.getUsername();
    if (name) {
      this.username = name;
    }
    this.loadStats();
  }

  loadStats(): void {
    this.foodStatsService.getStats().subscribe((data: any) => {
      this.stats = data
    })
  };

loadPantryItems(): void {
  this.pantryService.getPantryItems().subscribe((items: any) => {
    const pantryItems = items as Pantryitem[];
    this.pantryItemCount = pantryItems.length;

    this.expiringSoonItems = pantryItems
      .filter(item => this.isItemExpiringSoon(item.expirationDate))
      .sort((a, b) =>
        new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
      )
      .slice(0, 5);  // gets top 5 expiring items
  });

}

logout(): void {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}

isItemExpired(date: Date | string): boolean {
  return this.pantryService.isExpired(date);
}

isItemExpiringSoon(date: Date | string): boolean {
  return this.pantryService.isExpiringSoon(date);
}

getDaysUntilExpiration(date: Date | string): string {
  return this.pantryService.daysUntilExpiration(date);
}

getItemBadge(date: Date | string): { emoji: string, class: string, text: string } {
  return this.pantryService.getExpirationBadge(date);
}















}

import { Component, OnInit } from '@angular/core';
import { PantryitemService } from '../services/pantryitem.service';
import { CommonModule } from '@angular/common';
import { Pantryitem } from '../models/pantryitem';

@Component({
  selector: 'app-pantryitem',
  imports: [CommonModule],
  templateUrl: './pantryitem.component.html',
  styleUrl: './pantryitem.component.css'
})
export class PantryitemComponent implements OnInit {

  pantryItems: any[] = [];
  selectedItem: Pantryitem | null = null;
  constructor(private pantryService: PantryitemService) {}

  ngOnInit(): void {
      this.pantryService.getPantryItems().subscribe(
        data => {
          this.pantryItems = data as any[];
        }
      );
  }
  addNewPantryItem(pantryItem: Pantryitem): void{
    this.pantryService.addPantryItem(pantryItem).subscribe(response =>{
      alert('Pantry item added!')
    })
  }
  editItem(item: Pantryitem): void {
      //edit logic
  }
  
  deleteItem(itemId: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.pantryService.deletePantryItem(itemId).subscribe(() => {
        this.pantryItems = this.pantryItems.filter(item => item.itemId !== itemId);
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { PantryitemService } from '../services/pantryitem.service';
import { CommonModule } from '@angular/common';
import { Pantryitem } from '../models/pantryitem';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-pantryitem',
  imports: [CommonModule,FormsModule],
  templateUrl: './pantryitem.component.html',
  styleUrl: './pantryitem.component.css'
})
export class PantryitemComponent implements OnInit {
  toastClass: string = 'toast align-items-center text-white bg-success border-0';
  toastMessage: string = '';
  pantryItems: any[] = [];
  selectedItem: Pantryitem = 
  {
    itemId: 0,
    itemName: '',
    quantity: 0,
    unitOfMeasure: '',
    expirationDate: new Date(),
    userId: 0
  };

  editingItem: boolean = false;

  constructor(private pantryService: PantryitemService) {}

  ngOnInit(): void {
    this.loadItems();
  }


  loadItems(): void {
    this.pantryService.getPantryItems().subscribe(
      data => {
        this.pantryItems = (data as any[]).sort((a,b) => {
          return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        });
      }
    );
  }

  addNewPantryItem(pantryItem: Pantryitem): void{
    this.pantryService.addPantryItem(pantryItem).subscribe(response =>{
    })
  }

  editItem(item: Pantryitem): void {
     this.editingItem = true;
     this.selectedItem = { ...item};
     this.showModal();
  }


  saveItem(): void {
    if(this.editingItem){
      this.pantryService.updatePantryItem(this.selectedItem.itemId, this.selectedItem).subscribe(()=>
      {
        this.hideModal();
        this.loadItems();
        this.showToast('Pantry item updated!', 'success');
        
      }
      )}else{
      this.pantryService.addPantryItem(this.selectedItem).subscribe(() => {
        this.hideModal();
        this.loadItems();
        this.showToast('Pantry item added!', 'success');
        
      }
      )
    }
  }

  deleteItem(itemId: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.pantryService.deletePantryItem(itemId).subscribe(() => {
        this.pantryItems = this.pantryItems.filter(item => item.itemId !== itemId);
        this.showToast('Pantry item deleted!', 'danger');
        this.loadItems();
      });
    }
  }

  showModal(): void {
    const modalE = document.getElementById('pantryItemModal');
    const modal = new bootstrap.Modal(modalE!);
    modal.show();
  }

  hideModal(): void {
    const modalE = document.getElementById('pantryItemModal');
    const modal = bootstrap.Modal.getInstance(modalE!);
    modal?.hide();
  }
  openAddModal(): void {
    this.editingItem = false;
    this.selectedItem = {
      itemId: 0,
      itemName: '',
      quantity: 0,
      unitOfMeasure: '',
      expirationDate: new Date(),
      userId: 0
    };
    this.showModal();
  }

  showToast(message: string, type: 'success' | 'danger' = 'success'): void {
    this.toastClass = `toast align-items-center text-white bg-${type} border-0`;
    this.toastMessage = message;
  
    const toastEl = document.getElementById('toastMessage');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 1500 });
      toast.show();
    }
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
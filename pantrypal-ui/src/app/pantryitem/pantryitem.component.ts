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
        this.pantryItems = data as any[];
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
// #region Modal methods
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
// #endregion
  showToast(message: string, type: 'success' | 'danger' = 'success'): void {
    this.toastClass = `toast align-items-center text-white bg-${type} border-0`;
    this.toastMessage = message;
  
    const toastEl = document.getElementById('toastMessage');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 1500 });
      toast.show();
    }
  }

  isExpired(date: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    return target < today;
  }

  isExpiringSoon(date: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const target = new Date(date);
    const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && diffDays > 0;
  }

  daysUntilExpiration(date: Date | string): string {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(date);
    const diffDays = Math.ceil((target.getTime()-today.getTime())/(1000*60*60*24));
    if (diffDays === 0) {
      return 'Expires today';
    } else if (diffDays === 1) {
      return 'Expires tomorrow';
    } else if (diffDays > 1) {
      return `Expires in ${diffDays} days`;
    } else if (diffDays === -1) {
      return 'Expired yesterday';
    } else {
      return `Expired ${Math.abs(diffDays)} days ago`;
    }}

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
        return { emoji: '🟡', class: 'bg-warning text-dark', text: 'Expires tomorrow' };
      } else if (diffDays <= 3) {
        return { emoji: '🟡', class: 'bg-warning text-dark', text: `Expires in ${diffDays} days` };
      } else {
        return { emoji: '🟢', class: 'bg-success', text: `Expires in ${diffDays} days` };
      }
    }
}
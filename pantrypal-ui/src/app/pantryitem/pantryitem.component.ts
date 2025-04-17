import { Component, OnInit } from '@angular/core';
import { PantryitemService } from '../services/pantryitem.service';
import { CommonModule } from '@angular/common';
import { Pantryitem } from '../models/pantryitem';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-pantryitem',
  imports: [CommonModule, FormsModule],
  templateUrl: './pantryitem.component.html',
  styleUrl: './pantryitem.component.css'
})
export class PantryitemComponent implements OnInit {
  toastClass: string = 'toast align-items-center text-white bg-success border-0';
  toastMessage: string = '';
  pantryItems: any[] = [];
  searchTerm: string = '';
  multipleItems: Pantryitem[] = [
    {
      itemId: 0,
      itemName: '',
      quantity: 0,
      unitOfMeasure: '',
      expirationDate: new Date(),
      userId: 0
    }
  ];
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
  selectedItemIds: number[] = [];

  constructor(private pantryService: PantryitemService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.pantryService.getPantryItems().subscribe(data => {
      this.pantryItems = (data as any[]).sort((a, b) => {
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      });
      localStorage.setItem('pantryItems', JSON.stringify(this.pantryItems));
    });
  }

  get filteredPantryItems(): any[] {
    if (!this.searchTerm.trim()) {
      return this.pantryItems;
    }

    return this.pantryItems.filter(item =>
      item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  showMultipleModal(): void {
    const modalE = document.getElementById('multiItemModal');
    const modal = new bootstrap.Modal(modalE!);
    modal.show();
  }

  hideMultipleModal(): void {
    const modalE = document.getElementById('multiItemModal');
    const modal = bootstrap.Modal.getInstance(modalE!);
    modal?.hide();
  }

  addRow(): void {
    this.multipleItems.push({
      itemId: 0,
      itemName: '',
      quantity: 0,
      unitOfMeasure: '',
      expirationDate: new Date(),
      userId: 0
    });
  }

  removeRow(index: number): void {
    if (this.multipleItems.length > 1) {
      this.multipleItems.splice(index, 1);
    }
  }

  saveMultipleItems(): void {
    const missingFieldsItems = this.multipleItems.filter(item =>
      !item.itemName || item.quantity <= 0 || !item.unitOfMeasure || !item.expirationDate
    );

    if (missingFieldsItems.length > 0) {
      alert('All fields required');
      return;
    }

    this.multipleItems.forEach(item => {
      this.pantryService.addPantryItem(item).subscribe(() => {
        this.loadItems();
      });
    });

    this.multipleItems = [
      {
        itemId: 0,
        itemName: '',
        quantity: 0,
        unitOfMeasure: '',
        expirationDate: new Date(),
        userId: 0
      }
    ];

    this.hideMultipleModal();
    this.showToast('Pantry items added!', 'success');
  }

  editItem(item: Pantryitem): void {
    this.editingItem = true;
    this.selectedItem = { ...item };
    this.showModal();
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

  saveItem(): void {
    if (!this.selectedItem.itemName || this.selectedItem.quantity <= 0 || !this.selectedItem.unitOfMeasure || !this.selectedItem.expirationDate) {
      alert('All fields required');
      return;
    }

    if (this.editingItem) {
      this.pantryService.updatePantryItem(this.selectedItem.itemId, this.selectedItem).subscribe(() => {
        this.hideModal();
        this.loadItems();
        this.showToast('Pantry item updated!');
      });
    } else {
      this.pantryService.addPantryItem(this.selectedItem).subscribe(() => {
        this.hideModal();
        this.loadItems();
        this.showToast('Pantry item added!');
      });
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

  toggleItemSelection(itemId: number): void {
    const index = this.selectedItemIds.indexOf(itemId);
    if (index === -1) {
      this.selectedItemIds.push(itemId);
    } else {
      this.selectedItemIds.splice(index, 1);
    }
  }

  deleteSelectedItems(): void {
    if (this.selectedItemIds.length === 0) return;

    if (confirm('Are you sure you want to delete all selected items?')) {
      this.selectedItemIds.forEach(id => {
        this.pantryService.deletePantryItem(id).subscribe(() => {
          this.pantryItems = this.pantryItems.filter(item => item.itemId !== id);
          this.loadItems();
        });
      });

      this.selectedItemIds = [];
      this.showToast('Selected pantry items deleted!', 'danger');
    }
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
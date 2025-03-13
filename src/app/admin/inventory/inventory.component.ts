import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { ItemService } from '../../services/item.service';
import { Room } from '../../models/room';
import { Items } from '../../models/items';
import { ProductEntry } from '../../models/productEntry';

@Component({
  selector: 'app-inventory',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  // Dropdown lists
  rooms: Room[] = [];
  itemOptions: Items[] = [];

  // Overall inventory form fields
  purpose = '';
  addedBy = '';
  location = ''; // Selected room name
  status: 'incoming' | 'outgoing' | '' = '';

  // Fields for dynamically adding products
  selectedProductName = '';
  selectedProductQuantity: number | null = null;
  selectedProducts: ProductEntry[] = [];

  constructor(
    private settingsService: SettingsService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadItemOptions();
  }

  // Fetch available rooms for the location dropdown
  loadRooms(): void {
    this.settingsService.getRooms().subscribe((res: any) => {
      this.rooms = res.rooms; // expects response: { rooms: [...] }
    });
  }

  // Fetch available items for the item name dropdown
  loadItemOptions(): void {
    this.settingsService.getItems().subscribe((res: any) => {
      this.itemOptions = res.items; // expects response: { items: [...] }
    });
  }

  // Add a product to the temporary product list
  addProduct(): void {
    if (
      this.selectedProductName &&
      this.selectedProductQuantity !== null &&
      this.selectedProductQuantity > 0
    ) {
      this.selectedProducts.push({
        itemName: this.selectedProductName,
        quantity: this.selectedProductQuantity
      });
      // Reset the temporary product fields
      this.selectedProductName = '';
      this.selectedProductQuantity = null;
    }
  }

  // Remove a product from the temporary product list by index
  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
  }

// Submit a new inventory record with the dynamic products list
addItem(): void {
  if (
    !this.purpose ||
    !this.addedBy ||
    !this.location ||
    !this.status ||
    this.selectedProducts.length === 0
  ) {
    return;
  }

  const newItem = {
    purpose: this.purpose,
    addedBy: this.addedBy,
    location: this.location,
    status: this.status,
    itemName: this.selectedProductName,
    quantity: this.selectedProductQuantity ? this.selectedProductQuantity : 0,
    products: this.selectedProducts
  };

  // Call the correct service method: addInventory
  this.itemService.addInventory(newItem).subscribe((createdItem: any) => {
    // Optionally show a success message
    // Reset overall form fields and clear the product list
    this.purpose = '';
    this.addedBy = '';
    this.location = '';
    this.status = '';
    this.selectedProducts = [];
  });
}

}

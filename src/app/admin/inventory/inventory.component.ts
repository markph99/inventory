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
  // This property now holds the room's ObjectId (as a string) instead of a room name.
  location: string = '';
  status: 'incoming' | 'outgoing' | '' = '';

  // Fields for managing product modal and list
  selectedProductName = '';
  selectedProducts: ProductEntry[] = [];

  // Modal fields
  showProductModal = false;
  modalQuantity: number | null = null;
  hasSerialNumbers = false;
  modalSerialNumbers: string[] = [];
  // Instead of calling a function in the template, use a property:
  serialArray: number[] = [];

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
      this.rooms = res.rooms;
    });
  }

  // Fetch available items for the item name dropdown
  loadItemOptions(): void {
    this.settingsService.getItems().subscribe((res: any) => {
      this.itemOptions = res.items;
    });
  }

  // Called when a room is selected from the dropdown.
  // The dropdown should bind the room's _id value.
  onRoomSelected(selectedRoomId: string): void {
    this.location = selectedRoomId;
  }

  // Open the modal when a product is selected
  openProductModal(): void {
    if (this.selectedProductName) {
      this.showProductModal = true;
      // Reset modal fields
      this.modalQuantity = null;
      this.hasSerialNumbers = false;
      this.modalSerialNumbers = [];
      this.serialArray = [];
    }
  }

  // Called when the modalQuantity changes in the template
  onQuantityChange(newQuantity: number): void {
    this.modalQuantity = newQuantity;
    if (this.modalQuantity && this.modalQuantity > 0) {
      this.serialArray = Array.from({ length: this.modalQuantity }, (_, i) => i);
      this.modalSerialNumbers = new Array(this.modalQuantity).fill('');
    } else {
      this.serialArray = [];
    }
  }


  // Cancel the modal and reset fields
  cancelModal(): void {
    this.showProductModal = false;
    this.modalQuantity = null;
    this.hasSerialNumbers = false;
    this.modalSerialNumbers = [];
    this.serialArray = [];
  }

  // Save the product details from the modal
  saveModalProduct(): void {
    if (!this.modalQuantity || this.modalQuantity < 1) {
      return; // or show a validation error
    }
    // If serial numbers are required, check that all are provided
    if (this.hasSerialNumbers) {
      for (let i = 0; i < this.modalQuantity; i++) {
        if (!this.modalSerialNumbers[i]) {
          return; // or show a validation error
        }
      }
    }
    // Add the product with additional details
    const product: ProductEntry = {
      itemName: this.selectedProductName,
      quantity: this.modalQuantity,
      serialNumbers: this.hasSerialNumbers ? [...this.modalSerialNumbers] : []
    };
    this.selectedProducts.push(product);
    // Reset the selected product name so that the user must re-select for a new entry
    this.selectedProductName = '';
    // Close modal
    this.cancelModal();
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

    // Find the Room object matching the location string (room id)
    const room = this.rooms.find(r => r._id === this.location);
    if (!room) {
      return; // Optionally show a validation error if no matching room is found
    }

    const newItem = {
      purpose: this.purpose,
      addedBy: this.addedBy,
      location: room,
      status: this.status,
      products: this.selectedProducts
    };

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

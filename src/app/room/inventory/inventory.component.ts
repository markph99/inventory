import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { ItemService } from '../../services/item.service';
import { Room } from '../../models/room';
import { Items } from '../../models/items';
import { ProductEntry } from '../../models/productEntry';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-inventory',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  // Available item options for the dropdown
  itemOptions: Items[] = [];

  // Overall inventory form fields
  purpose = '';
  addedBy = '';
  // "location" now holds the current room's ObjectId (set automatically)
  location: string = '';
  status: 'incoming' | 'outgoing' | '' = '';

  // New property for binding the current room name in the template
  currentRoom: string = '';

  // Optionally store the full current room object for display and submission
  currentRoomObject: Room | null = null;

  // Fields for managing product modal and list
  selectedProductName = '';
  selectedProducts: ProductEntry[] = [];

  // Modal fields
  showProductModal = false;
  modalQuantity: number | null = null;
  hasSerialNumbers = false;
  modalSerialNumbers: string[] = [];
  serialArray: number[] = [];

  constructor(
    private settingsService: SettingsService,
    private itemService: ItemService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // Assume the authService now provides both the room name and room id.
    const roomId = this.authService.getRoomId(); // must return a valid ObjectId string, e.g., "60f5a3e5e4b0c12d34567890"
    const roomName = this.authService.getRoomName() || 'Unknown Room';

    // Check if roomId is available and valid.
    if (!roomId) {} else {
      this.location = roomId; // Use the actual room id
      this.currentRoom = roomName;
      // Optionally, store the full room object if needed for display, but do NOT send it to the backend.
      this.currentRoomObject = { _id: roomId, roomName: roomName, roomPassword: '' };
    }
    this.loadItemOptions();
  }


  // Fetch available items for the item name dropdown.
  loadItemOptions(): void {
    this.settingsService.getItems().subscribe((res: any) => {
      this.itemOptions = res.items;
    });
  }

  // Open the modal when a product is selected.
  openProductModal(): void {
    if (this.selectedProductName) {
      this.showProductModal = true;
      // Reset modal fields.
      this.modalQuantity = null;
      this.hasSerialNumbers = false;
      this.modalSerialNumbers = [];
      this.serialArray = [];
    }
  }

  // Called when the modalQuantity changes in the template.
  onQuantityChange(newQuantity: number): void {
    this.modalQuantity = newQuantity;
    if (this.modalQuantity && this.modalQuantity > 0) {
      this.serialArray = Array.from({ length: this.modalQuantity }, (_, i) => i);
      this.modalSerialNumbers = new Array(this.modalQuantity).fill('');
    } else {
      this.serialArray = [];
    }
  }

  // Cancel the modal and reset fields.
  cancelModal(): void {
    this.showProductModal = false;
    this.modalQuantity = null;
    this.hasSerialNumbers = false;
    this.modalSerialNumbers = [];
    this.serialArray = [];
  }

  // Save the product details from the modal.
  saveModalProduct(): void {
    if (!this.modalQuantity || this.modalQuantity < 1) {
      return; // Optionally show a validation error.
    }
    // If serial numbers are required, check that all are provided.
    if (this.hasSerialNumbers) {
      for (let i = 0; i < this.modalQuantity; i++) {
        if (!this.modalSerialNumbers[i]) {
          return; // Optionally show a validation error.
        }
      }
    }
    // Create a new product entry and add it to the list.
    const product: ProductEntry = {
      itemName: this.selectedProductName,
      quantity: this.modalQuantity,
      serialNumbers: this.hasSerialNumbers ? [...this.modalSerialNumbers] : []
    };
    this.selectedProducts.push(product);
    // Reset the selected product name so the user must re-select for a new entry.
    this.selectedProductName = '';
    // Close modal.
    this.cancelModal();
  }

  // Remove a product from the temporary product list by index.
  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
  }

  // Submit a new inventory record with the dynamic products list.
  addItem(): void {
    // Check if all required fields and a valid Room object exist.
    if (
      !this.purpose ||
      !this.addedBy ||
      !this.currentRoomObject ||  // Ensure a valid Room object is available
      !this.status ||
      this.selectedProducts.length === 0
    ) {
      return;
    }

    const newItem = {
      purpose: this.purpose,
      addedBy: this.addedBy,
      location: this.currentRoomObject, // Sending the full Room object
      status: this.status,
      products: this.selectedProducts
    };

    this.itemService.addInventory(newItem).subscribe(
      (createdItem: any) => {
        // Optionally show a success message.
        // Reset overall form fields and clear the product list.
        this.purpose = '';
        this.addedBy = '';
        // We keep the room info intact if you wish to maintain it.
        this.status = '';
        this.selectedProducts = [];
      }
    );
  }

}

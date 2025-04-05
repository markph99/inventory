import { Component } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Inventory } from '../../models/inventory';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items',
  imports: [CommonModule, FormsModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {
  items: Inventory[] = [];
  filteredItems: Inventory[] = [];
  paginatedItems: Inventory[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getInventories().subscribe((res: Inventory[]) => {
      // Sort items with newest items first (assumes Inventory has a createdAt field)
      this.items = res.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      // Initialize filteredItems with all items.
      this.filteredItems = this.items;
      this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
      this.paginateItems();
    });
  }

  paginateItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateItems();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateItems();
    }
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      this.filteredItems = this.items.filter(item => {
        // Check Purpose
        const inPurpose = item.purpose && item.purpose.toLowerCase().includes(term);
        // Check Added By
        const inAddedBy = item.addedBy && item.addedBy.toLowerCase().includes(term);
        // Check Location (assuming roomName is the field to search)
        const inLocation = item.location &&
                           item.location.roomName &&
                           item.location.roomName.toLowerCase().includes(term);
        // Check Status
        const inStatus = item.status && item.status.toLowerCase().includes(term);
        // Check Products: iterate over products to search within product names
        const inProducts = item.products && item.products.some(product =>
          product.itemName && product.itemName.toLowerCase().includes(term)
        );
        return inPurpose || inAddedBy || inLocation || inStatus || inProducts;
      });
    } else {
      this.filteredItems = this.items;
    }
    // Reset pagination after search
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
    this.paginateItems();
  }
}

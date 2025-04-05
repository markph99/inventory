import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Inventory } from '../../models/inventory';

@Component({
  selector: 'app-item-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-management.component.html',
  styleUrls: ['./item-management.component.css']
})
export class ItemManagementComponent implements OnInit {
  // For the search input in the template
  searchTerm: string = '';

  // All inventory records loaded from the API
  fullInventory: Inventory[] = [];

  // The filtered and paginated inventory records to display
  paginatedItems: Inventory[] = [];

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10; // Adjust as needed

  // The current room id stored in localStorage (via AuthService)
  currentRoomId: string = '';

  constructor(
    private itemService: ItemService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // Retrieve the current room id from AuthService.
    this.currentRoomId = this.authService.getRoomId() || '';
    if (!this.currentRoomId) {
      return;
    }

    // Load all inventory records from the backend.
    this.itemService.getInventories().subscribe({
      next: (data: Inventory[]) => {
        // Save all records.
        this.fullInventory = data;
        // Filter to include only the records for the current room.
        // Assuming item.location is a Room object, comparing its _id property with currentRoomId.
        this.fullInventory = this.fullInventory.filter(
          item => item.location && item.location._id === this.currentRoomId
        );
        // If location was a simple string, use: item => item.location === this.currentRoomId

        // Apply search filtering and pagination.
        this.applyFiltersAndPagination();
      },
    });
  }

  /**
   * Applies search filtering and pagination to the fullInventory array.
   */
  applyFiltersAndPagination(): void {
    // Filter records based on the search term.
    const filtered = this.fullInventory.filter(item =>
      item.purpose.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.addedBy.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Sort the filtered records by createdAt in descending order.
    const sorted = filtered.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    // Calculate total pages.
    this.totalPages = Math.ceil(sorted.length / this.pageSize) || 1;

    // Ensure the current page is within bounds.
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    } else if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // Get the items for the current page.
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedItems = sorted.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Called when the user types in the search input.
   */
  onSearch(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  /**
   * Navigate to the previous page.
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFiltersAndPagination();
    }
  }

  /**
   * Navigate to the next page.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFiltersAndPagination();
    }
  }
}

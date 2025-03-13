import { Component } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Inventory } from '../../models/inventory';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-items',
  imports: [CommonModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
  items: Inventory[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    // Call the correct service method: getInventories()
    this.itemService.getInventories().subscribe((res: Inventory[]) => {
      this.items = res;
    });
  }
}

import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance',
  imports: [  ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent {

  selectedTab: 'items' = 'items';
  itemName: string = '';
  itemDescription: string = '';

  selectTab(tab: 'items') {
    this.selectedTab = tab;
  }
  constructor(private settingsService: SettingsService) {}

  registerItem() {
    if (this.itemName && this.itemDescription) {
      this.settingsService.registerItem({
        itemName: this.itemName,
        itemDescription: this.itemDescription
      }).subscribe(
        res => {
          console.log('Item registered:', res);
          // Optionally reset the form or show a success message
          this.itemName = '';
          this.itemDescription = '';
        },
        err => {
          console.error('Error registering item:', err);
        }
      );
    }
  }
}

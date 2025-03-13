import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true, // if using Angular standalone components; otherwise remove
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  selectedTab: 'room' | 'items' = 'room';
  roomName: string = '';
  itemName: string = '';
  itemDescription: string = '';

  constructor(private settingsService: SettingsService) {}

  selectTab(tab: 'room' | 'items') {
    this.selectedTab = tab;
  }

  registerRoom() {
    if (this.roomName) {
      this.settingsService.registerRoom({ roomName: this.roomName }).subscribe(
        res => {
          console.log('Room registered:', res);
          // Optionally reset the form or show a success message
          this.roomName = '';
        },
        err => {
          console.error('Error registering room:', err);
        }
      );
    }
  }

  registerItem() {
    if (this.itemName && this.itemDescription) {
      this.settingsService.registerItem({ itemName: this.itemName, itemDescription: this.itemDescription }).subscribe(
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

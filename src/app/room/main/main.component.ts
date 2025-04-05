import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { Items } from '../../models/items';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  roomName: string = '';
  items: Items[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.roomName = this.authService.getRoomName() || 'Unknown Room';
    this.loadItems();
  }


  loadItems(): void {
    this.isLoading = true;
    // Get items from your backend. If needed, you can filter items by this.roomName.
    this.settingsService.getItems().subscribe(
      (res: { items: Items[] }) => {
        this.items = res.items;
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  onLogout(): void {
    // Clear the authentication token and room name from storage.
    this.authService.logout();
    localStorage.removeItem('roomName');
    this.router.navigate(['/']);
  }
}

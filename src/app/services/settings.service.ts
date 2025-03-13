import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.localServer.apiKey}/api`;

  constructor(private http: HttpClient) {}

  // Register a new room
  registerRoom(roomData: { roomName: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms`, roomData);
  }

  // Fetch all rooms (for the location dropdown)
  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms`);
  }

  // Register a new item
  registerItem(itemData: { itemName: string, itemDescription: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, itemData);
  }

  // Fetch all items (for the item name dropdown)
  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/items`);
  }
}

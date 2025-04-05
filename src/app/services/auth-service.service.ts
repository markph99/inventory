import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  // Use your environment variable for the API URL
  private apiUrl = `${environment.localServer.apiKey}/api`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a login request to the backend.
   * @param credentials Object with username and password.
   * @returns An observable containing the response.
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Saves the JWT token to localStorage.
   * @param token JWT token string.
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Retrieves the JWT token from localStorage.
   * @returns The JWT token if available, or null.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Saves the room name to localStorage.
   * @param roomName The name of the room.
   */
  setRoomName(roomName: string): void {
    localStorage.setItem('roomName', roomName);
  }

  /**
   * Retrieves the room name from localStorage.
   * @returns The room name if available, or null.
   */
  getRoomName(): string | null {
    return localStorage.getItem('roomName');
  }

  /**
   * Saves the room id to localStorage.
   * @param roomId The identifier of the room.
   */
  setRoomId(roomId: string): void {
    localStorage.setItem('roomId', roomId);
  }

  /**
   * Retrieves the room id from localStorage.
   * @returns The room id if available, or null.
   */
  getRoomId(): string | null {
    return localStorage.getItem('roomId');
  }

  /**
   * Logs out the user by removing the token, room name, and room id from localStorage.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roomName');
    localStorage.removeItem('roomId');
  }
}

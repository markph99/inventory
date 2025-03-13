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
   * Saves the token to localStorage.
   * @param token JWT token string.
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Retrieves the token from localStorage.
   * @returns The JWT token if available, or null.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Logs out the user by removing the token from localStorage.
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}

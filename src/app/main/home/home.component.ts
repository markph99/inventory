import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { SettingsService } from '../../services/settings.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Inventory Management System';
  showLoginModal: boolean = true;

  // Toggle between 'admin' and 'room' login
  loginType: 'admin' | 'room' = 'admin';

  // Admin login form
  adminLoginForm!: FormGroup;

  // Room login form
  roomLoginForm!: FormGroup;

  loginError: string = '';

  // New properties for toggling password visibility
  adminPasswordVisible: boolean = false;
  roomPasswordVisible: boolean = false;

  // Toggle functions for password visibility
  toggleAdminPasswordVisibility(): void {
    this.adminPasswordVisible = !this.adminPasswordVisible;
  }

  toggleRoomPasswordVisibility(): void {
    this.roomPasswordVisible = !this.roomPasswordVisible;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private settingsService: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.roomLoginForm = this.fb.group({
      roomName: ['', Validators.required],
      roomPassword: ['', Validators.required]
    });
  }

  // Admin login method
  onAdminLogin(): void {
    if (this.adminLoginForm.invalid) return;
    const { username, password } = this.adminLoginForm.value;
    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.showLoginModal = false;
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loginError = err.error.message || 'Login failed. Please try again.';
      }
    });
  }

  // Room login method (updated to store room id)
  onRoomLogin(): void {
    if (this.roomLoginForm.invalid) return;
    const { roomName, roomPassword } = this.roomLoginForm.value;
    this.settingsService.loginRoom({ roomName, roomPassword }).subscribe({
      next: async (res) => {
        // Store the token
        this.authService.setToken(res.token);

        // Dynamically import jwt-decode.
        const jwtModule: any = await import('jwt-decode');
        const jwtDecode = jwtModule.jwtDecode;
        if (typeof jwtDecode !== 'function') {
          return;
        }
        const decode = jwtDecode.bind(null);
        const decodedToken: any = decode(res.token);

        // Save the room name extracted from the token payload.
        if (decodedToken.roomName) {
          this.authService.setRoomName(decodedToken.roomName);
        }

        // Attempt to extract the room id from several possible property names.
        const roomId = decodedToken.roomId || decodedToken.id || decodedToken.room_id;
        if (roomId && typeof roomId === 'string' && roomId.trim() !== '') {
          this.authService.setRoomId(roomId);
        }

        this.showLoginModal = false;
        // Navigate to the room-specific page.
        this.router.navigate(['/room']);
      },
      error: (err) => {
        this.loginError = err.error.message || 'Room login failed. Please try again.';
      }
    });
  }
}

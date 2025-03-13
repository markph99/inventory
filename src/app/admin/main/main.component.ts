import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-main',
  imports: [RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private authService: AuthServiceService, private router: Router) {}

  logout(): void {
    // Clear token from local storage via the AuthServiceService
    this.authService.logout();
    // Navigate to the login page
    this.router.navigate(['/']);
  }
}

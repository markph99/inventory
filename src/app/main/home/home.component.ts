import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Inventory } from '../../models/inventory';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Inventory Management System';
  showLoginModal: boolean = false;
  loginForm!: FormGroup;
  loginError: string = '';

  inventories: Inventory[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private inventoryService: ItemService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loadInventories();
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.showLoginModal = false;
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loginError = err.error.message || 'Login failed. Please try again.';
        console.error('Login error:', err);
      }
    });
  }

  loadInventories(): void {
    this.inventoryService.getInventories().subscribe({
      next: (data: Inventory[]) => {
        this.inventories = data;
      },
      error: (err) => {
        console.error('Failed to load inventories:', err);
      }
    });
  }

  // Helper method to calculate the total quantity of products in an inventory record
  totalQuantity(inventory: Inventory): number {
    return inventory.products
      ? inventory.products.reduce((total, prod) => total + prod.quantity, 0)
      : 0;
  }

  // Helper method to join product names
  getProductNames(inventory: Inventory): string {
    return inventory.products && inventory.products.length > 0
      ? inventory.products.map(prod => prod.itemName).join(', ')
      : '';
  }
}

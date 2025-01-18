import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DealerService } from '../../services/dealerService/dealer.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddressComponent } from "../address/address.component";
import { CartService } from '../../services/cartService/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, AddressComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartCrops: any[] = [];
  userId: string | null = null;
  cartItems: any[] = [];

  increaseQuantity(crop: any): void {
    if (crop.selectedQuantity < crop.availableQuantity) {
      crop.selectedQuantity++;
      this.updateQuantity(crop.cropId, crop.selectedQuantity);
    }
  }

  decreaseQuantity(crop: any): void {
    if (crop.selectedQuantity > 1) {
      crop.selectedQuantity--;
      this.updateQuantity(crop.cropId, crop.selectedQuantity);
    }
  }

  constructor(
    private dealerService: DealerService,
    private cookieService: CookieService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCart();
    this.loadCartItems();
  }

  loadCartItems() {
    this.dealerService.getCartDetails().subscribe({
      next: (data) => {
        this.cartItems = data; // Store cart items locally
      },
      error: (err) => {
        console.error('Error fetching cart details:', err);
      },
    });
  }

  get totalQuantity(): number {
    return this.cartCrops.reduce((total, crop) => total + crop.selectedQuantity, 0);
  }

  get totalPrice(): number {
    return this.cartCrops.reduce(
      (total, crop) => total + crop.selectedQuantity * crop.pricePerKg,
      0
    );
  }

  fetchCart(): void {
    const token = this.cookieService.get('authToken');
    if (!token) {
      console.error('User not authenticated');
      return;
    }

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) {
      console.error('Invalid or missing token');
      return;
    }

    this.userId = decodedToken.nameid;

    this.dealerService.getCartDetails().subscribe({
      next: (data) => {
        this.cartCrops = data.map((crop: any) => ({
          ...crop,
          selectedQuantity: 1, // Default to 1 Kg initially
        }));
        console.log('Cart Crops:', this.cartCrops);
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      },
    });
  }

  decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  updateQuantity(cropId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Explicitly cast the event target
    const quantity = Number(inputElement.value) || 1; // Ensure valid number
    const crop = this.cartCrops.find((c) => c.cropId === cropId);
    if (crop) {
      crop.selectedQuantity = quantity;
  
      this.dealerService.updateCartQuantity(cropId, quantity).subscribe({
        next: () => {
          console.log(`Quantity for crop ${cropId} updated to ${quantity}`);
        },
        error: (err) => {
          console.error(`Error updating quantity for crop ${cropId}`, err);
        },
      });
    }
  }
  
  removeFromCart(cropId: number): void {
    this.dealerService.removeFromCart(cropId).subscribe({
      next: () => {
        this.cartCrops = this.cartCrops.filter((crop) => crop.cropId !== cropId);
        console.log(`Crop with ID ${cropId} removed from cart`);
        this.cartService.decrementCartCount();
      },
      error: (err) => {
        console.error(`Error removing crop with ID ${cropId}`, err);
      },
    });
  }

  proceedToPayment(): void {
    this.router.navigate(['/payment'], { queryParams: { totalPrice: this.totalPrice, totalQuantity: this.totalQuantity } });
  }
  
  goToBuyCrop(){
    this.router.navigate(['/dealer']);
  }
}

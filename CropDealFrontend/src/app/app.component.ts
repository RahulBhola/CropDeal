import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { DealerService } from './services/dealerService/dealer.service';
import { CartService } from './services/cartService/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;
  isDropdownVisible = false;
  cartCount: number = 0;

  constructor(
    private cookieService: CookieService, 
    private dealerService: DealerService,
    private cartService: CartService, 
    private router: Router
  ) {}

  decodedToken(token: string):any {
    try{
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    }
    catch(error){
      console.error('Error decoding token: ', error);
      return null;
    }
  }

  fetchUserRole(){
    const token = this.cookieService.get('authToken');
    if(!token){
      console.error('User not authenticated');
      return;
    }
    const decodedToken = this.decodedToken(token);
    if(!decodedToken){
      console.error('Invalid or missing token');
      return;
    }
    this.userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.cookieService.get('authToken');

    // Fetch user role
    if (this.isLoggedIn) {
      this.fetchUserRole();
    }

    // Subscribe to cart count updates
    this.cartService.currentCartCount.subscribe(count => {
      this.cartCount = count;
    });

    // Load initial cart count
    this.loadCartCount();
  }

  loadCartCount() {
    if (this.userRole === 'Dealer') {
      this.dealerService.getCartDetails().subscribe({
        next: (data) => {
          this.cartService.updateCartCount(data.length); // Update shared count
        },
        error: (err) => {
          console.error('Error fetching cart details:', err);
        },
      });
    }
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isInsideDropdown = target.closest('.dropdown-container');
    if (!isInsideDropdown) {
      this.isDropdownVisible = false;
    }
  }

  logout(): void {
    this.cookieService.delete('authToken');
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}
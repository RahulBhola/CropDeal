import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FarmerService } from '../../services/farmerService/farmer.service';
import { CookieService } from 'ngx-cookie-service';
import { DealerService } from '../../services/dealerService/dealer.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cartService/cart.service';

@Component({
  selector: 'app-dealer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dealer.component.html',
  styleUrl: './dealer.component.css'
})
export class DealerComponent implements OnInit {
  crops: any[] = [];
  cart: any[] = [];
  filteredCrops: any[] = [];
  searchText: string = '';
  cartItems: any[] = [];

  constructor(
    private farmerService: FarmerService,
    private dealerService: DealerService,
    private cartService: CartService,
    private cookieService: CookieService
  ){
    this.decodeToken(this.cookieService.get('authToken'));
    this.farmerService.getAllFarmerCrops().subscribe({
      next: (data)=>{
        this.crops = data;
        this.filteredCrops = data;
        console.log('Crops:', this.crops);
      },
      error: (err)=>{
        console.error('Error fetching crops:', err);
      }
    })
  }

  ngOnInit(): void {
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

  // Check if crop already exists in the cart
  isCropInCart(cropId: number): boolean {
    return this.cartItems.some(item => item.cropId === cropId);
  }

  decodeToken(token: string): any {
    try{
      const payload = atob(token.split('.')[1]);
      console.log(payload);
      return JSON.parse(payload);
    }
    catch(e){
      console.error('Error decoding token: ', e);
      return null;
    }
  }
  addToCart(crop: any) {
    const token = this.cookieService.get('authToken');
    // console.log(token);
    if(!token){
      alert('User not authenticated');
      return;
    }
    const decodedToken: any = this.decodeToken(token);
    const userId = decodedToken?.nameid;
    console.log(userId);

    if(!userId){
      alert("User Id not found in token.");
      return;
    }
    // Check if the crop already exists in the cart
    if (this.isCropInCart(crop.cropId)) {
      alert('This crop is already in the cart!');
      return; // Stop further execution
    }
    this.dealerService.addToCart(userId, crop.cropId).subscribe({
      next: (response)=>{
        console.log('Crops added to cart: ', response.message);
        this.cartService.incrementCartCount();
        this.cartItems.push(crop);
      },
      error: (err)=>{
        console.error('Error adding crop to cart: ', err);
      },
    });
    // const exists = this.cart.find((item) => item.cropId === crop.cropId);
    // if (!exists) {
    //   this.cart.push({ ...crop, count: 1 });
    // } else {
    //   exists.count += 1; 
    // }
    // console.log('Cart:', this.cart); 
  }

  filterCrops() {
    if (this.searchText.trim() === '') {
      this.filteredCrops = this.crops;
    } else {
      this.filteredCrops = this.crops.filter(crop =>
        crop.cropName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
}

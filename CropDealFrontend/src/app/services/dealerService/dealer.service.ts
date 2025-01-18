import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private apiUrl = 'http://localhost:5142/api/Dealer';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ){}

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  addToCart(userId:string, cropId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const payload = {
      userId,
      cartCrops: [cropId], 
    };
    return this.http.post(`${this.apiUrl}/AddToCart`, payload, { headers });
  }

  getCartDetails(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/ViewCart`, { headers });
  }
  
  removeFromCart(cropId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const payload = cropId; // Send cropId as body payload
    return this.http.request('delete', `${this.apiUrl}/RemoveFromCart`, {
      headers,
      body: payload,
    });
  } 
  updateCartQuantity(cropId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/cart/${cropId}`, { quantity });
  } 
}

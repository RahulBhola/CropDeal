import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl = 'http://localhost:5142/api/Payments';
  private apiUrlForOrder = 'http://localhost:5142/api/Order';

  constructor(private http: HttpClient, 
    private cookieService: CookieService
  ) {}

  createPaymentIntent(amount: number) {
    return this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/create-payment-intent`,
      { amount }
    );
  }

  saveOrderTransaction(orderTransactionData: any) {
    const token = this.cookieService.get('authToken'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.post<{ orderTransactionId: number, invoiceId: number }>(
      `${this.apiUrlForOrder}/create-order`,
      orderTransactionData,
      {headers}
    );
  }

  // saveOrderTransaction(orderTransactionData: any) {
  //   return this.http.post<{ OrderTransactionId: number }>(
  //     `${this.apiUrl}/save-order-transaction`,
  //     orderTransactionData
  //   );
  // }
}

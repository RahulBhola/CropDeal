import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:5142/api/Order';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getInvoiceDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-order-details/${orderId}`);
  }

  getAllInvoice():Observable<any[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/get-orders-by-user`, {headers});
  }

  getAllInvoiceForAdmin():Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all-invoices`);
  }
  
  sendInvoiceEmail(email: string, invoiceId: number) {
    const url = `http://localhost:5142/api/Invoice/SendEmail?email=${email}&invoiceId=${invoiceId}`; 
    return this.http.post(url, null); 
  }
}

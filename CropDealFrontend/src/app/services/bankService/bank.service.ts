import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = 'http://localhost:5142/api/BankAccount';
  constructor(private http: HttpClient,private cookieService : CookieService) { }

  addBankAccount(bankDetails: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/AddBankAccount`, bankDetails, {headers});
  }

  getBankDetails(): Observable<any[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/GetBankAccountDetails`, {headers});
  }

  updateBankAccount(accountId:number ,bankDetails: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.put(`${this.apiUrl}/UpdateBankAccount/${accountId}`, bankDetails, { headers });
  }

  deleteBankAccount(accountId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/DeleteBankAccount/${accountId}`, {headers});
  } 
}
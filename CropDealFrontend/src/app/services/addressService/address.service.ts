import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:5142/api/Address';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  addAddress(addressDetails: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/AddAddress`, addressDetails, {headers});
  }

  getAddress(): Observable<any[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/GetAddress`, {headers});
  }

  updateAddress(addressId: number,addressDetails: any): Observable<any>{
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/UpdateAddress/${addressId}`, addressDetails, {headers});
  }

  deleteAddress(addressId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/DeleteAddress/${addressId}`, {headers});
  }
}

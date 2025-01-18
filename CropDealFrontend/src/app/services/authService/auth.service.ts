import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5142/api/User';
  
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  register(user: {userName: string; email: string; password: string; role: string;}): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  updateProfile(userData: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/update-profile`, userData, {headers});
  }
  getUserDetails(): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/get-user-details`, {headers});
  }
  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all-users`)
  }
}

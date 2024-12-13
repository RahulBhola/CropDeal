import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5174/api/User';
  
  constructor(
    private http: HttpClient
  ) {}

  register(user: {userName: string; email: string; password: string; role: string;}): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  login(credentials: {email: string, password: string, role: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}

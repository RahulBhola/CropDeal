import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  private apiUrl = 'http://localhost:5142/api/Farmer';
  constructor(
    private http: HttpClient,
    private cookieService : CookieService
  ) { }

  addCropDetails(cropDetails:any): Observable<any> {
    const token = this.cookieService.get('authToken'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.post(`${this.apiUrl}/AddCrop`, cropDetails, {headers});
  }

  getCropDetails(): Observable<any[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/GetCrops`, {headers});
  }
  
  updateCropDetails(cropId: number, cropDetails: any): Observable<any>{
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/EditCrop/${cropId}`, cropDetails, {headers});
  }

  deleteCrop(cropId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/DeleteCrop/${cropId}`, {headers});
  }

  getAllFarmerCrops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllCrops`);
  }
}

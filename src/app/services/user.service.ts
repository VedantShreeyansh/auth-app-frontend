import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/api/users`; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  // Fetch pending user registration requests
  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pending`);
  }

  // Approve user registration
  approveUser(approvalData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/approve`, approvalData);
  }
}

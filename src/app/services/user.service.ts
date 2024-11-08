import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getRegistrationRequests() {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${environment.apiUrl}/api/users`; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  // Fetch pending user registration requests
  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pending`);
  }

  // Approve or reject user registration
  approveUser(approvalData: { userId: string, isApproved: boolean }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/approve`, approvalData);
  }

  // Fetch user by ID (make sure userId is the _id (UUID))
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }
}

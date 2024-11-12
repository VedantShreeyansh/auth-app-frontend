import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface PendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/api/User`; // Adjust based on your backend URL

  constructor(private http: HttpClient) {}

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/info`);
  }

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(`${this.baseUrl}/pending`);
  }

  approveUser(userId: string, role: 'admin' | 'user', isSuperAdmin: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${userId}/approve`, { role, isSuperAdmin });
  }

  rejectUser(userId: string, isSuperAdmin: boolean): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/reject?isSuperAdmin=${isSuperAdmin}`);
  }

  getUserById(userId: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/${userId}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiUrl = 'http://localhost:5114'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  // Method to log in the user
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Auth/login`, loginData);
  }

  // Method to register a new user
  register(user: any): Observable<any> {
    const credentials = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      isApproved: false
    };
    return this.http.post(`${this.apiUrl}/api/Auth/register`, credentials);
  }

  // Method to store the token in local storage
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Method to log out the user and remove the token
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionId');
  }

  //Method to store session ID in local storage
  storeSessionId(sessionId: string): void {
    localStorage.setItem('sessionId', sessionId);
  }

  //Method to get session ID from local storage
  getSesssionId(): string | null {
    return localStorage.getItem('sessionId');
  }
}
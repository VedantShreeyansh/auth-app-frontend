import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,  private router: Router) { }

  // Login method
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Auth/login`, loginData).pipe(
      tap((response: any) => {
        console.log('Login Response:', response); 
        if (response.token) {
          this.storeToken(response.token);
  
          const userId = response.user?._id || response.user?.id;  // Change from response.user?.id to response.user?._id
          if (userId) {
            this.getUserById(userId).subscribe(user => {
              localStorage.setItem('userRole', user.role.toLowerCase());
              localStorage.setItem('userStatus', user.status);

               // Generate and store session ID
               const sessionId = new Date().getTime().toString();
               this.storeSessionId(sessionId);
            });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error?.message === "User is not approved for login.") {
          return throwError(() => new Error("User is not approved for login."))
        }
        return throwError(() => new Error(error.message))
      })
    );
  }

  // Register method
  register(user: any): Observable<any> {
    const credentials = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      status: 'Pending'
    };
    return this.http.post(`${this.apiUrl}/api/Auth/register`, credentials);
  }

  // Store the token in local storage
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Logout the user and remove the token
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userStatus');
  }

  // Store session ID in local storage
  storeSessionId(sessionId: string): void {
    localStorage.setItem('sessionId', sessionId);
  }

  // Get session ID from local storage
  getSessionId(): string | null {
    return localStorage.getItem('sessionId');
  }

  // Fetch pending users
  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/User/pending`);
  }

  // Approve or reject users
  approveUser(userId: string, isApproved: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/User/approve`, { userId, status: isApproved ? 'Approved' : 'Rejected' });
  }

  // Fetch user by ID (make sure it works with _id)
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/User/${userId}`);  // Ensure userId is the _id (UUID)
  }
}

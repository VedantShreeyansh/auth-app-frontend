import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  // Login method
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Auth/login`, loginData).pipe(
      switchMap((response: any) => {
        console.log('Login Response:', response);
        if (response.token) {
          this.storeToken(response.token);

          const userId = response.user?.id;
          if (userId) {
            return this.getUserById(userId).pipe(
              tap(user => {
                sessionStorage.setItem('userRole', user.role.toLowerCase());
                sessionStorage.setItem('userStatus', user.status);
                sessionStorage.setItem('userId', user._id);

                const sessionId = new Date().getTime().toString();
                this.storeSessionId(sessionId);
              })
            );
          }
        }
        return of(response);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error?.message === "User is not approved for login.") {
          return throwError(() => new Error("User is not approved for login."));
        }
        return throwError(() => new Error(error.message));
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

  // Store the token in session storage
  private storeToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  // Logout the user and remove the token
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userStatus');
  }

  // Store session ID in session storage
  public storeSessionId(sessionId: string): void {
    sessionStorage.setItem('sessionId', sessionId);
  }

  // Get session ID from session storage
  getSessionId(): string | null {
    return sessionStorage.getItem('sessionId');
  }

  // Clear session ID from session storage
  clearSessionId(): void {
    sessionStorage.removeItem('sessionId');
  }

  // Fetch user by ID (make sure it works with _id)
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/User/${userId}`);  // Ensure userId is the _id (UUID)
  }
}
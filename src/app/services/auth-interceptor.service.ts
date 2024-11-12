import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken'); // Ensure the key matches what's in AuthService
    console.log('Token in interceptor:', token);

    const authReq = token ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }) : req;

    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        // Handle success for registration
        if (event instanceof HttpResponse && event.body?.message === 'Registration Successful') {
          this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle unauthorized access
        if (error.status === 401) {
          this.snackBar.open('Unauthorized access. Please log in again.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']); // Redirect to login page after 401 error
        } else {
          // Handle other errors
          this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
        }
        console.error('HTTP Error:', error); // Log error for debugging
        return throwError(error);
      })
    );
  }
}
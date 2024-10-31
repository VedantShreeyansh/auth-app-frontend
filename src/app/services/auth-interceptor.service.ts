import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add token to headers if available
    const token = localStorage.getItem('jwtToken');
    const authReq = token ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }) : req;

    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body?.message === 'Registration Successful') {
            this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Display a snack bar based on the error type
        if (error.status === 400 && error.error?.message) {
          this.snackBar.open(`Registration failed: ${error.error.message}`, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
        }
        return throwError(error); // Return the error to the caller
      })
    );
  }
}

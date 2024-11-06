import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken'); // Ensure the key matches what's in AuthService
    const authReq = token ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }) : req;

    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body?.message === 'Registration Successful') {
          this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.snackBar.open('Unauthorized access. Please log in again.', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
        }
        return throwError(error);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(observer => {
      next.handle(req).subscribe({
        next: (event: HttpEvent<any>) => {
          observer.next(event);
          if (event instanceof HttpResponse) {
            if (event.body && event.body.message === 'Registration Successful') {
              this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          observer.error(error); // Emit the error
          if (error.status === 400 && error.error && error.error.message) {
            this.snackBar.open(`Registration failed: ${error.error.message}`, 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
          }
        },
        complete: () => observer.complete() // Complete the observable
      });
    });
  }
}

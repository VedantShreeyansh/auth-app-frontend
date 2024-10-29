import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

// Custom Error State Matcher
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: any): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.email
    ])
  });

  matcher = new MyErrorStateMatcher();
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  onSubmit() {
    // if (this.loginForm.invalid) {
    //     return;
    // }

    this.loading = true;
    const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
    };

    const loginEndpoint = "http://localhost:5114/api/Auth/login";

    this.http.post<any>(loginEndpoint, loginData).subscribe({
        next: (response) => {
            if (localStorage.getItem('token')) {
                this.loading = false;
                this.errorMessage = "You have already logged in another window or tab";
                return;
            }
            else {
                localStorage.setItem('token', response.token); // Store the token in local storage
                localStorage.setItem('role', response?.user?.role);
            }
            
            // Determine user role and redirect based on it
            console.log(response);

            const userRole = localStorage.getItem('role'); // Assume 'role' is part of the response

            if (userRole?.toLowerCase() === 'admin') {
                this.router.navigate(['/dashboard']); // Admin dashboard route
            } else if (userRole?.toLowerCase() === 'user') {
                this.router.navigate(['/dashboard']); // User dashboard route
            } else {
                this.errorMessage = 'Invalid role detected.';
            }

            this.loading = false;
        },
        error: (err) => {
            console.error("Login failed", err); // Log the error for debugging
            this.loading = false;
            this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
                duration: 3000
            });
        },
    });
  }
}

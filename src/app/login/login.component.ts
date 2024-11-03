import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  matcher = new MyErrorStateMatcher();
  loading = false; // Add the loading property

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {

     console.log("Initializing the submit function");
     console.log(this.loginForm.value.email);
     console.log(this.loginForm.value.password);
     console.log(this.loginForm.valid);



    if (this.loginForm.valid) {
      this.loading = true; // Set loading to true when the form is submitted
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      // check if the user is already logged in from another window
      if (this.authService.getSesssionId()) {
        this.errorMessage = 'You are already logged in from another window.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        this.loading = false;
        return;
      }

      this.authService.login(loginData).subscribe({
        next: (response) => {
          if (!response.token || !response.user?.role) {
            this.errorMessage = 'Invalid login response.';
            this.loading = false; // Set loading to false if the response is invalid
            return;
          }

          this.authService.storeToken(response.token); // Store the token in local storage
          localStorage.setItem('role', response.user.role);

           // Generate a unique session ID and store it in local storage
           const sessionId = new Date().getTime().toString();
           this.authService.storeSessionId(sessionId);
 
          // Determine user role and redirect based on it
          console.log(response);

          const userRole = localStorage.getItem('role'); // Assume 'role' is part of the response

          if (userRole?.toLowerCase() === 'admin') {
            this.router.navigate(['/dashboard']); // Admin dashboard route
          } else if (userRole?.toLowerCase() === 'user') {
            console.log("navigating");
            this.router.navigate(['/dashboard']); // User dashboard route
          } else {
            this.errorMessage = 'Invalid role detected.';
          }

          this.loading = false; // Set loading to false after processing the response
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'Login failed. Please try again.';
          this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
          this.loading = false; // Set loading to false if there is an error
        }
      });
    }
  }
}
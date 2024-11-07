import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  loading = false;

  constructor(
    private fb: FormBuilder,
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
      this.loading = true;
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      // Check if the user is already logged in from another window
      if (this.authService.getSessionId()) {
        this.errorMessage = 'You are already logged in from another window.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        this.loading = false;
        return;
      }

      this.authService.login(loginData).subscribe({
        next: (response) => {
          // Ensure response includes _id (UUID), role, and status
          console.log('Response:', response);
          if (!response._id || !response.role || !response.status) {
            this.errorMessage = 'Invalid login response.';
            this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
            this.loading = false;
            return;
          }

         
          // Store token and session ID
        //  this.authService.storeToken(response.token);
        //  const sessionId = new Date().getTime().toString();
        //  this.authService.storeSessionId(sessionId);

          const userRole = response?.role.toLowerCase();
          const userStatus = response?.status;

          console.log('userRole:', userRole);
          console.log('userStatus:', userStatus)

          // Role-based redirection based on status
          if (userRole === 'admin' && userStatus === 'Approved') {
            console.log("navigating to the dashboard");
            this.router.navigate(['/dashboard']);
          } else if (userRole === 'user' && userStatus === 'Approved') {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'User is not approved for login.';
            this.router.navigate(['/pending-approval']);
            this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Login Error:', err); 
          this.errorMessage = err.error.message || 'Login failed. Please try again.';
          this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}

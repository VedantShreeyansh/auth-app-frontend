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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique IDs

@Component({
  selector: 'app-signup',
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
    MatSelectModule,
    MatOptionModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['user'] // Default role set to User
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return; // Stop if the form is invalid
    }

    // Create the signup data including the _id and Id fields
    // Simplified Signup Data without Id
    const signupData = {
  //  _id: uuidv4(),
    firstName: this.signupForm.value.firstName,
    lastName: this.signupForm.value.lastName,
    email: this.signupForm.value.email,
    password: this.signupForm.value.password,
    role: this.signupForm.value.role,
    status: "Pending" // Default status to 'Pending'
    };


    console.log('Signup Data:', signupData); // Add log to inspect the form data

    const signupEndpoint = "http://localhost:5114/api/Auth/register";

    // Send the signup data to the backend
    this.http.post<any>(signupEndpoint, signupData, {
      headers: {
        'Content-Type': 'application/json' // Set content type to JSON
      }
    }).subscribe({
      next: (response) => {
        // Check for response.message and display success message
        this.snackBar.open(response.message || 'Registration successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/login']); // Redirect to the login page after successful registration
      },
      error: (err) => {
        // Handle errors and show an appropriate error message
        const errorMessage = err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err); // Log the error for debugging
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      }
    });
  }
}

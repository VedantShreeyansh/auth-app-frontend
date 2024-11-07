import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    const userStatus = localStorage.getItem('userStatus'); // Assuming you store user status in localStorage
    const userRole = localStorage.getItem('userRole'); // Get the user role from local storage


    if (token) {
      if (userStatus === 'Approved') {
        if (userRole === 'admin' || userRole === 'user') {
          // Navigate to dashboard based on role and approved status
          this.router.navigate(['/dashboard']);
          return true; // Authorized and navigate to dashboard
        }
      } else {
        // Redirect to pending approval page if the user is not approved
        this.router.navigate(['/pending-approval']);
        return false;
      }
    } else {
      // Redirect to login page if there's no token
      this.router.navigate(['/login']);
      return false;
    }
    return false; // Default return value if no conditions are met
  }
}

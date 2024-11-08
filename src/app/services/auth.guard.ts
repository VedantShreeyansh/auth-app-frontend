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
      console.log("token achieved");
      console.log(token, userRole, userStatus);
      if (userStatus === 'Approved') {
          // Navigate to dashboard based on role and approved status
          return true; // Authorized and navigate to dashboard
      }
      return false; 
    } else {
      // Redirect to login page if there's no token
      this.router.navigate(['/login']);
      return false;
    }
    return false; // Default return value if no conditions are met
  }
}



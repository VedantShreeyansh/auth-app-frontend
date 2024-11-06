import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    const userStatus = localStorage.getItem('userStatus'); // Assuming you store user status in localStorage
    const userRole = localStorage.getItem('userRole'); // Get the user role from local storage

    if (token) {
      if (userStatus === 'Approved') {
        // Optionally check for user role if needed
        if (userRole) {
          // Assuming you may have some roles like 'admin' or 'user'
          // You can implement role-based logic here if needed
          return true; // Authorized
        } else {
          console.log('Access denied - User role not found.');
          return false; // Not authorized due to missing role
        }
      } else {
        // Redirect to a message page or show a notification
        this.router.navigate(['/pending-approval']); // Create a dedicated route for pending users
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

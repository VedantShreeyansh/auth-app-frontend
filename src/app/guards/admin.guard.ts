import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    const userStatus = localStorage.getItem('userStatus');
    const userRole = localStorage.getItem('userRole');

    if (token) {
      console.log("token achieved");
      console.log(token, userRole, userStatus);

      // Check if the user is approved
      if (userStatus === 'Approved') {

        // Check if the user is an admin when accessing the admin panel
        if (this.router.url.includes('admin-panel') && userRole !== 'admin') {
          this.router.navigate(['/dashboard']); // Redirect to home or dashboard if not an admin
          return false;
        }

        return true; // Authorized access
      }

      // If user status is not approved
      return false;
    } else {
      // Redirect to login page if no token
      this.router.navigate(['/login']);
      return false;
    }
  }
}
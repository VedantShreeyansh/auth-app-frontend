import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally, you can add more validation logic here, such as checking token expiration
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

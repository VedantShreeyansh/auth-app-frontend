import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { throwIfEmpty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('authToken');
    const userStatus = localStorage.getItem('userStatus'); // Assuming you store user status in localStorage
    const userRole = localStorage.getItem('userRole');// Get the user role from local storage



    if (!token){
      this.router.navigate(['/login']);
      return false;
    }

    console.log("token achieved");
    console.log(token, userRole, userStatus);

    switch (userStatus){
      case 'Approved':
        if (state.url === '/pending-approval' || state.url === '/login'){
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;

      case 'Pending':
        if (state.url === '/pending-approval'){
          return true;
        } else {
          this.router.navigate(['/pending-approval']);
          return false;
        }

        default:
          // Invalid or undefined status, redirect to login
          this.router.navigate(['/login']);
          return false;
    }
  }
}













      //previous pending user-logic

  //   if (token) {
  //     console.log("Token achieved");
  //     console.log(token, userRole, userStatus);

  //     if (userStatus === 'Approved') {
  //      this.router.navigate(['/dashboard']);
  //      return true; // Navigate to dashboard based on role and approved status
  // // Authorized and navigate to dashboard
  //     } else if (userStatus === 'Pending') {
  //       if (state.url !== '/pending-approval') {
  //         this.router.navigate(['/pending-approval']);
  //         return false;
  //       }
  //       return false;
  //     } else {
  //       if (state.url !== '/login') {
  //         this.router.navigate(['/login']);
  //       }
  //       return false;
  //     }
  //   } else {
  //     if (state.url !== '/login') {
  //       this.router.navigate(['/login']);
  //     }
  //     return false;
  //   }
 

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { TimeoutService } from '../services/timeout.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule],
 templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  timeoutId: any;
  userRole: string | null = null;

 constructor(
   private _snackBar: MatSnackBar, 
   private router: Router,
   private timeoutService: TimeoutService
 ) {
    this.userRole = sessionStorage.getItem('userRole'); // Ensure correct key
 }


 ngOnDestroy(): void {
   this.timeoutService.clearTimeout();
 }

 ngOnInit(): void {
   console.log(sessionStorage.getItem("authToken"));
   this.userRole = sessionStorage.getItem('userRole'); // Ensure correct key
   if (!this.getSessionId()) {
     this.logout();
   }
   if (this.userRole === 'admin'){
     this.onTabChange({
       tab:{
       textLabel: 'A'
       }
    });
   }
   console.log('User Role in Dashboard:', this.userRole);
 }

getSessionId(): string | null {
   return sessionStorage.getItem('sessionId');
 }

 goToAdminPanel(): void{
   console.log("navigating");
   this.router.navigate(['/admin-panel']);
 }

 goToNoticeBoard(): void {
   console.log("navigating");
   this.router.navigate(['/noticeBoard']);
 }

 logout(): void {
   sessionStorage.removeItem('authToken');
   sessionStorage.removeItem('sessionId');
   sessionStorage.removeItem('userRole');
   sessionStorage.removeItem('userStatus');
   sessionStorage.removeItem('userId');
   this.router.navigate(['/login']);
  }

  onTabChange(event: any): void {
   if (this.timeoutId) {
     clearTimeout(this.timeoutId);    }
    if (event.index === 0) {
     this.timeoutId = setTimeout(() => {
       this._snackBar.open('Tab 0 selected', 'Close', { duration: 2000 });
      }, 1000);
    }
  }
}




















// import { Component } from '@angular/core';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [MatTabsModule, MatButtonModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],
// })
// export class DashboardComponent {
//   timeoutId: any;
//   userRole: string | null = null;

//   constructor(
//     private _snackBar: MatSnackBar,
//     private router: Router
//   ) {
//   //  this.userRole = sessionStorage.getItem('role');
//     this.userRole='admin';
//   }

//   ngOnInit(): void {
//   //  this.userRole = sessionStorage.getItem('role');
//     console.log('User Role in Dashboard:', this.userRole);
//   }

//   onTabChange(event: any): void {
//     if (this.timeoutId) {
//       clearTimeout(this.timeoutId);
//     }

//     if (event.index === 0) {
//       this.timeoutId = setTimeout(() => {
//         this.logout();
//       }, 10000);
//     }
//   }

//   logout(): void {
//     console.log('logout clicked');
//   //  sessionStorage.clear();
//     this.router.navigate(['/login']);
//   }
// }
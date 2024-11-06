import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    this.userRole = localStorage.getItem('role');
  }

  @HostListener('window:beforeunload', ['$event'])
  clearSessionId(event: Event): void {
    localStorage.removeItem('sessionId');
  }

  ngOnDestroy(): void {
    this.timeoutService.clearTimeout();
  }

  ngOnInit(): void {
    console.log(localStorage.getItem("authToken"));

    this.userRole = localStorage.getItem('role');
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
    return localStorage.getItem('sessionId');
  }

  goToNoticeBoard(): void {
    console.log("navigating");
    this.router.navigate(['/noticeboard']);
  }

  onTabChange(event: any): void {
    const selectedTabLabel = event.tab.textLabel;

    if (this.userRole === 'admin' && selectedTabLabel === 'A') {
      this.timeoutService.startTimeout(20000, 'You have been timed out from tab A', () => {
        this.logout();
      });
    }
    else if (this.userRole !== 'admin' && selectedTabLabel === 'F') {
      this.timeoutService.startTimeout(20000, 'You have been timed out from tab F', () => {
        this.logout();
      });
    } else {
      this.timeoutService.clearTimeout();
    }
  }

  logout(): void {
    console.log('logout clicked');
    localStorage.clear(); // Clear local storage, including sessionId and JWT token
    this.router.navigate(['/login']); // Navigate to login page
  }
}
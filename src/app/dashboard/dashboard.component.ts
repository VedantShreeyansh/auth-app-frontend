import { Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  timeoutId: any;
  userRole: string | null = null;

  constructor(
    private _snackBar: MatSnackBar, 
    private router: Router,
    private timeoutService: TimeoutService
  ) {
    this.userRole = localStorage.getItem('role');
  }

  ngOnDestroy(){
    this.timeoutService.clearTimeout();
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    if (this.userRole === 'admin'){
      this.onTabChange({
        tab:{
          textLabel: 'A'
        }
      })
    }
    console.log('User Role in Dashboard:', this.userRole);
  }

  onTabChange(event: any) {
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
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
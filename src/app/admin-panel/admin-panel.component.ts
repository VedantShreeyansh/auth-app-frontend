import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { Observable, forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface PendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  form: FormGroup;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [UserService]
})
export class AdminPanelComponent implements OnInit {
  pendingUsers: PendingUser[] = [];
  isSuperAdmin = false;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchUserInfo();
    this.fetchPendingUsers();
  }

  fetchUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next: (userData) => {
        this.isSuperAdmin = userData.status === 'Approved' && userData.role === 'admin';
      },
      error: (error) => {
        console.error('Failed to fetch user info:', error);
        this.showSnackbar('Failed to fetch user info. Please try again later.');
      }
    });
  }

  fetchPendingUsers(): void {
    this.userService.getPendingUsers().subscribe({
      next: (data: PendingUser[]) => {
        this.pendingUsers = data.map(user => ({
          ...user,
          form: this.fb.group({
            isApproved: [user.status === 'Approved', Validators.requiredTrue]
          })
        }));
      },
      error: (error) => {
        console.error('Failed to load pending users:', error);
        this.showSnackbar('Failed to load pending users. Please try again later.');
      }
    });
  }

  approveUser(pendingUser: PendingUser): void {
    this.isProcessing = true;
    this.userService.approveUser(pendingUser._id, pendingUser.role, this.isSuperAdmin).pipe(
      tap(() => {
        this.showSnackbar(`User ${pendingUser.firstName} ${pendingUser.lastName} approved successfully.`);
        this.updatePendingUsers(pendingUser._id, 'Approved');
      }),
      catchError((error) => {
        console.error('Error approving user:', error);
        this.showSnackbar(`Failed to approve user ${pendingUser.firstName} ${pendingUser.lastName}. Please try again.`);
        return []; // Return an empty array to complete the observable
      }),
      tap(() => {
        this.isProcessing = false;
      })
    ).subscribe();
  }

  private updatePendingUsers(userId: string, status: string): void {
    this.pendingUsers = this.pendingUsers.filter(user => user._id !== userId);
  }


  rejectUser(pendingUser: PendingUser): void {
    this.isProcessing = true;
    this.userService.rejectUser(pendingUser._id, this.isSuperAdmin).pipe(
      tap(() => {
        this.showSnackbar(`User ${pendingUser.firstName} ${pendingUser.lastName} rejected successfully.`);
        this.updatePendingUsers(pendingUser._id, 'Rejected');
      }),
      catchError((error) => {
        console.error('Error rejecting user:', error);
        this.showSnackbar(`Failed to reject user ${pendingUser.firstName} ${pendingUser.lastName}. Please try again.`);
        return []; // Return an empty array to complete the observable
      }),
      tap(() => {
        this.isProcessing = false;
      })
    ).subscribe();
  }

  
  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
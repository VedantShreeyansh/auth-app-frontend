import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [UserService],
})
export class AdminPanelComponent implements OnInit {
  registrationRequests: any[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchRegistrationRequests();
  }

  fetchRegistrationRequests(): void {
    this.userService.getPendingUsers().subscribe({
      next: (data: any[]) => {
        this.registrationRequests = data.map(user => ({
          ...user,
          form: this.fb.group({
            isApproved: [false, Validators.requiredTrue]
          })
        }));
      },
      error: (error) => console.error('Failed to load registration requests:', error)
    });
  }

  approveUser(request: any): void {
    if (request.form.valid) {
      const approvalData = { userId: request.id, isApproved: request.form.value.isApproved };
      this.userService.approveUser(approvalData).subscribe({
        next: () => {
          this.fetchRegistrationRequests(); // Refresh the list after approval
        },
        error: (error) => console.error('Error approving user:', error)
      });
    }
  }

  rejectUser(userId: string): void {
    const approvalData = { userId, isApproved: false }; // Prepare data for rejection
    this.userService.approveUser(approvalData).subscribe({
      next: () => {
        this.fetchRegistrationRequests(); // Refresh the list after rejection
      },
      error: (error) => console.error('Error rejecting user:', error)
    });
  }
}

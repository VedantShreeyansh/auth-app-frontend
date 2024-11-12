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
    console.log("Admin page entered");
    this.userService.getPendingUsers().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          // Mapping over each user to add a form group for approval
          this.registrationRequests = data.map(user => ({
            ...user,
            form: this.fb.group({
              isApproved: [false, Validators.requiredTrue]  // Default value and validation
            })
          }));
        } else {
          this.registrationRequests = [];  // No requests to display
        }
      },
      error: (error) => {
        console.error('Failed to load registration requests:', error);
        this.registrationRequests = [];  // In case of error, we can clear any previous data
      }
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
    } else if ((!request.form.valid)) {
      console.log('Form is not valid');
      return;
    }
    else null;
  }

  rejectUser(request: any): void {
    const rejectionData = { userId: request.id, isApproved: false }; // Prepare data for rejection
    this.userService.approveUser(rejectionData).subscribe({
      next: () => {
        this.fetchRegistrationRequests(); // Refresh the list after rejection
      },
      error: (error) => console.error('Error rejecting user:', error)
    });
  }
}

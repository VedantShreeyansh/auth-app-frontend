import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [UserService], // Ensure the service is provided here
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class AdminPanelComponent implements OnInit {
  registrationRequests: any[] = [];
  approvalForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.approvalForm = this.fb.group({
      userId: ['', Validators.required],
      isApproved: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.fetchRegistrationRequests();
  }

  fetchRegistrationRequests(): void {
    this.userService.getPendingUsers().subscribe({
      next: (data: any[]) => this.registrationRequests = data,
      error: (error) => console.error('Failed to load registration requests:', error)
    });
  }

  approveUser(): void {
    if (this.approvalForm.valid) {
      const approvalData = this.approvalForm.value;
      this.userService.approveUser(approvalData).subscribe({
        next: () => {
          this.fetchRegistrationRequests(); // Refresh the requests after approval
          this.approvalForm.reset();
        },
        error: (error) => console.error('Error approving user:', error)
      });
    }
  }
}
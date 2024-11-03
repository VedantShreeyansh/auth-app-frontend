import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoticeboardService } from '../services/noticeboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-noticeboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css'],
  providers: [NoticeboardService]  // Ensure the service is provided here
})
export class NoticeboardComponent implements OnInit {
  noticeForm: FormGroup;
  messages: any[] = [];
  userRole: string | null = localStorage.getItem('role');

  constructor(private fb: FormBuilder, private noticeboardService: NoticeboardService, private router: Router) {
    this.noticeForm = this.fb.group({
      message: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("opening noticeboard");
    // Check if user is admin; if not, redirect to user dashboard
    this.fetchMessages();
    // if (this.userRole?.toLowerCase() !== 'admin') {
    //   this.router.navigate(['/dashboard']);
    // } else {
    //   this.fetchMessages();
    // }
  }

  fetchMessages(): void {
    this.noticeboardService.getMessages().subscribe({
      next: (data: any[]) => this.messages = data,
      error: (error) => console.error('Failed to load messages:', error)
    });
  }

  sendMessage(): void {
    if (this.noticeForm.valid) {
      const messageData = {
        text: this.noticeForm.get('message')?.value,
        role: this.noticeForm.get('role')?.value,
      };
      
      this.noticeboardService.sendMessage(messageData).subscribe({
        next: () => {
          this.fetchMessages(); // Refresh messages after sending
          this.noticeForm.reset();
        },
        error: (error) => console.error('Error sending message:', error)
      });
    }
  }
}
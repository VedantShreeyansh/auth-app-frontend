import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoticeboardService } from '../services/noticeboard.service';
import { SignalRService } from '../services/signalr.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Message {
  sender: string;
  receiver: string;
  text: string;
  timestamp: Date;
}

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
    MatIconModule,
  ],
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css'],
  providers: [NoticeboardService]
})
export class NoticeboardComponent implements OnInit {
  noticeForm: FormGroup;
  messages: Message[] = [];
  userRole: string | null = sessionStorage.getItem('role');
  currentUser: string | null = sessionStorage.getItem('username');
  currentUserId: string | null = sessionStorage.getItem('userId');

  constructor(
    private fb: FormBuilder,
    private noticeboardService: NoticeboardService,
    private signalRService: SignalRService,
    private router: Router
  ) {
    this.noticeForm = this.fb.group({
      message: ['', Validators.required],
      receiver: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("Opening noticeboard component...");
    this.signalRService.startConnection();
    this.signalRService.addReceiveMessageListener((sender, receiver, message, timestamp) => {
      if (sender === this.currentUserId || receiver === this.currentUserId) {
        console.log('Received message:', { sender, receiver, message, timestamp });
        this.messages.push({ sender, receiver, text: message, timestamp });
        this.sortMessages();
      }
    });

    this.fetchMessages();
  }

  fetchMessages(): void {
    this.noticeboardService.getMessages().subscribe({
      next: (data: Message[]) => {
        this.messages = data.filter(
          (message) =>
            message.sender === this.currentUserId || message.receiver === this.currentUserId
        );
        this.sortMessages();
      },
      error: (error) => console.error('Failed to load messages:', error)
    });
  }

  sendMessage(): void {
    if (this.noticeForm.valid) {
      const messageData: Message = {
        sender: this.currentUserId || 'currentUser',
        receiver: this.noticeForm.get('receiver')?.value,
        text: this.noticeForm.get('message')?.value,
        timestamp: new Date()
      };

      console.log(messageData);
      
      this.noticeboardService.sendMessage(messageData).subscribe({
        next: () => {
          this.fetchMessages(); // Refresh messages after sending
          this.noticeForm.reset();
        },
        error: (error) => console.error('Error sending message:', error)
      });
    }
  }

  private sortMessages(): void {
    this.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}
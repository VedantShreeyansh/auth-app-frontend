import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoticeboardService } from '../services/noticeboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


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
  providers: [NoticeboardService]
})
export class NoticeboardComponent implements OnInit {
  noticeForm: FormGroup;
  messages: any[] = [];

  constructor(private fb: FormBuilder, private noticeboardService: NoticeboardService) {
    this.noticeForm = this.fb.group({
      message: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchMessages();
  }

  fetchMessages(): void {
    this.noticeboardService.getMessages().subscribe((data: any[]) => {
      this.messages = data;
    });
  }

  sendMessage(): void {
    if (this.noticeForm.valid) {
      const messageData = this.noticeForm.value;
      this.noticeboardService.sendMessage(messageData).subscribe(() => {
        this.fetchMessages(); // Refresh messages after sending
        this.noticeForm.reset();
      });
    }
  }
}

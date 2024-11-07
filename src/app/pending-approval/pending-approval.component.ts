import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.css']
})
export class PendingApprovalComponent {

  constructor(private router: Router) {}

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event: Event): void {
    localStorage.clear();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event): void {
    localStorage.clear();
  }
}
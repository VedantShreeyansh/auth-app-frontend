import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LoginComponent, SignupComponent, NoticeboardComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'auth-app';
  ngOnInit(): void {
    console.log("Initialized");
  }
  
  // @HostListener('window:beforeunload', ['$event'])
  // clearSessionStorage(event: Event) {
  //   sessionStorage.clear();
  // }
}
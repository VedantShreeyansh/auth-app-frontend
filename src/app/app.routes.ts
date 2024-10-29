import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
     canActivate: [AuthGuard],
  },
  {
    path: 'noticeboard',
    component: NoticeboardComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
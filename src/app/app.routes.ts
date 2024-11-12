import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';

import { NoticeboardComponent } from './noticeboard/noticeboard.component';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';

import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UserService } from './services/user.service';
import { AdminGuard } from './gaurds/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
     canActivate: [AuthGuard],
  },
  {
    path: 'noticeBoard',
    component: NoticeboardComponent,
  //  canActivate: [AuthGuard],
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
  //  data: { role: 'admin', status: 'Approved' } 
  },
  { path: 'pending-approval',
   component: PendingApprovalComponent,
    canActivate: [AuthGuard],
   },
  { 
    path: 'pending-approval',
   component: PendingApprovalComponent,
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
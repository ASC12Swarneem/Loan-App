import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ApplyLoanComponent } from './apply-loan/apply-loan.component';
import { LoansListComponent } from './loans-list/loans-list.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'apply-loan', component: ApplyLoanComponent, canActivate: [AuthGuard] },
  { path: 'loan-list', component: LoansListComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

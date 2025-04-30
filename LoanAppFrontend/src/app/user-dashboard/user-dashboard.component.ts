import { Component } from '@angular/core';
import { LoanApplication } from '../models/loanapplication.model';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  loans: LoanApplication[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans(): void {
    this.loanService.getUserLoans().subscribe({
      next: (res) =>{
        console.log('Loan response:', res); // <== Check this
        this.loans = res;
      },
        //  this.loans = res,
      error: (err) => console.error('Error fetching loans', err)
    });
  }
}

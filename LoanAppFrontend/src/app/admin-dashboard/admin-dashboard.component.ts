import { Component, OnInit } from '@angular/core';
import { LoanService } from '../services/loan.service';
import { LoanApplication } from '../models/loanapplication.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  loans: LoanApplication[] = [];
  filterStatus: string = '';
  isLoading: boolean = false;  // New loading state

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.isLoading = true;  // Set loading state to true before making the request
    this.loanService.getAllLoans(this.filterStatus).subscribe({
      next: (data) => {
        console.log('Loans data:', data);
        if (Array.isArray(data)) {
          this.loans = data;
        } else {
          console.error('Expected an array of loans but got:', data);
        }
      },
      error: (err) => {
        console.error('Failed to load loans', err);
      },
      complete: () => {
        this.isLoading = false;  // Set loading state to false after the request completes
      }
    });
  }

  onFilterChange(): void {
    this.loadLoans();
  }

  updateStatus(loanId: number, newStatus: string, remarks: string): void {
    const updateData = { status: newStatus, adminRemarks: remarks };
    this.loanService.updateLoanStatus(loanId, updateData).subscribe({
      next: () => {
        console.log('Loan status updated');
        this.loadLoans();
      },
      error: (err) => {
        console.error('Failed to update loan', err);
      }
    });
  }
}

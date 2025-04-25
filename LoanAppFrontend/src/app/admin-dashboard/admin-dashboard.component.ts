import { Component } from '@angular/core';
import { LoanService } from '../services/loan.service';
import { OnInit } from '@angular/core';
import { LoanApplication } from '../models/loanapplication.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  loans: any[] = [];
  filterStatus: string = '';

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getAllLoans(this.filterStatus).subscribe({
      next: data => this.loans = data,
      error: err => console.error("Error fetching loans", err)
    });
  }

  onFilterChange(): void {
    this.loadLoans();
  }

  updateStatus(loanId: number, status: string, remarks: string): void {
    const updateData = { status, adminRemarks: remarks };
    this.loanService.updateLoanStatus(loanId, updateData).subscribe({
      next: () => {
        alert("Status updated!");
        this.loadLoans();
      },
      error: err => console.error("Update failed", err)
    });
  }
}

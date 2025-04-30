// import { Component, OnInit } from '@angular/core';
// import { LoanService } from '../services/loan.service';

// @Component({
//   selector: 'app-loans-list',
//   templateUrl: './loans-list.component.html',
//   styleUrl: './loans-list.component.css'
// })
// export class LoansListComponent implements OnInit {
//   loans: any[] = [];

//   constructor(private loanService: LoanService) {}

//   ngOnInit(): void {
//     this.loadLoans();
//   }

//   loadLoans(): void {
//     this.loanService.getAllLoans('').subscribe({
//       next: data => {
//         this.loans = data;
//       },
//       error: err => {
//         console.error("Failed to load loans", err);
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { LoanService } from '../services/loan.service';
import { LoanApplication } from '../models/loanapplication.model';

@Component({
  selector: 'app-loans-list',
  templateUrl: './loans-list.component.html',
  styleUrls: ['./loans-list.component.css']
})
export class LoansListComponent implements OnInit {
  loans: LoanApplication[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getAllLoans('').subscribe({
      next: (data) => {
        this.loans = data;
      },
      error: (err) => {
        console.error("Failed to load loans", err);
      }
    });
  }
}

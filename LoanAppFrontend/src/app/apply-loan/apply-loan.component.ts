import { Component } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'app-apply-loan',
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.css']
})
export class ApplyLoanComponent {
  loanForm!: FormGroup;

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.loanForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1000)]],
      termInMonths: ['', [Validators.required, Validators.min(12)]],
      monthlyIncome: ['', [Validators.required, Validators.min(20000)]],
      creditScore: ['', [Validators.required, Validators.min(300), Validators.max(850)]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Apply loan method
  applyLoan(): void {
    if (this.loanForm.valid) {
      this.loanService.applyLoan(this.loanForm.value).subscribe({
        next: res => {
          console.log("Loan Applied!", res);
          alert("Loan applied successfully!");
          this.loanForm.reset();
        },
        error: err => {
          console.error("Loan Application Failed!", err);
          alert("Loan Application Failed!");
        }
      });
    } else {
      alert('Please fill in the form correctly.');
    }
  }
}
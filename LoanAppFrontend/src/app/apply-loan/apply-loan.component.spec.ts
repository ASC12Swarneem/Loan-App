import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyLoanComponent } from './apply-loan.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LoanService } from '../services/loan.service';
import { of, throwError } from 'rxjs';

describe('ApplyLoanComponent', () => {
  let component: ApplyLoanComponent;
  let fixture: ComponentFixture<ApplyLoanComponent>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoanService', ['applyLoan']);

    await TestBed.configureTestingModule({
      declarations: [ApplyLoanComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: LoanService, useValue: spy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyLoanComponent);
    component = fixture.componentInstance;
    loanServiceSpy = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply for a loan if form is valid', () => {
    spyOn(window, 'alert');
    spyOn(console, 'log');

    component.loanForm.setValue({
      amount: 10000,
      termInMonths: 12,
      monthlyIncome: 25000, 
      creditScore: 700,
      fullName: 'John Doe',
      email: 'john@example.com'
    });

    loanServiceSpy.applyLoan.and.returnValue(of({ success: true }));

    component.applyLoan();

    expect(loanServiceSpy.applyLoan).toHaveBeenCalledWith(component.loanForm.value);
    expect(window.alert).toHaveBeenCalledWith('Loan applied successfully!');
    expect(console.log).toHaveBeenCalled();
  });

  it('should show error if applyLoan fails', () => {
    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.loanForm.setValue({
      amount: 10000,
      termInMonths: 12,
      monthlyIncome: 25000,
      creditScore: 700,
      fullName: 'John Doe',
      email: 'john@example.com'
    });

    loanServiceSpy.applyLoan.and.returnValue(throwError(() => new Error('API error')));

    component.applyLoan();

    expect(window.alert).toHaveBeenCalledWith('Loan Application Failed!');
    expect(console.error).toHaveBeenCalled();
  });

  it('should alert user if form is invalid', () => {
    spyOn(window, 'alert');

    component.loanForm.setValue({
      amount: null,
      termInMonths: null,
      monthlyIncome: null,
      creditScore: null,
      fullName: '',
      email: ''
    });

    component.applyLoan();

    expect(window.alert).toHaveBeenCalledWith('Please fill in the form correctly.');
    expect(loanServiceSpy.applyLoan).not.toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDashboardComponent } from './user-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoanService } from '../services/loan.service'; 
import { of, throwError } from 'rxjs';  
import { LoanApplication } from '../models/loanapplication.model';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;

  beforeEach(async () => {
    loanServiceSpy = jasmine.createSpyObj('LoanService', ['getUserLoans']);

    await TestBed.configureTestingModule({
      declarations: [UserDashboardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LoanService, useValue: loanServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch loans successfully and update the loans property', () => {
    const mockLoans: LoanApplication[] = [
      {
        id: 1,
        amount: 10000,
        termInMonths: 12,
        monthlyIncome: 5000,
        creditScore: 700,
        status: 'Approved',
        applicationDate: '2023-01-01',
        fullName: 'John Doe',
        email: 'john@example.com',
        adminRemarks: null
      },
      {
        id: 2,
        amount: 5000,
        termInMonths: 6,
        monthlyIncome: 3000,
        creditScore: 650,
        status: 'Pending',
        applicationDate: '2023-02-01',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        adminRemarks: null
      }
    ];

    loanServiceSpy.getUserLoans.and.returnValue(of(mockLoans));

    spyOn(console, 'log');
    component.fetchLoans();

    expect(component.loans).toEqual(mockLoans);
    expect(loanServiceSpy.getUserLoans).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Loan response:', mockLoans);
  });

  it('should log an error if fetching loans fails', () => {
    spyOn(console, 'error');

    loanServiceSpy.getUserLoans.and.returnValue(throwError(() => new Error('Error fetching loans')));

    component.fetchLoans();

    expect(console.error).toHaveBeenCalledWith('Error fetching loans', jasmine.any(Error));
    expect(component.loans).toBeUndefined();
  });
});

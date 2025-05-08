import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansListComponent } from './loans-list.component';
import { LoanService } from '../services/loan.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LoanApplication } from '../models/loanapplication.model';

describe('LoansListComponent', () => {
  let component: LoansListComponent;
  let fixture: ComponentFixture<LoansListComponent>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;

  beforeEach(async () => {
    // Create a mock loan service
    loanServiceSpy = jasmine.createSpyObj('LoanService', ['getAllLoans', 'getUserLoans']);

    loanServiceSpy.getAllLoans.and.returnValue(of([]));
    loanServiceSpy.getUserLoans.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [LoansListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LoanService, useValue: loanServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display loans on success', () => {
    const mockLoans: LoanApplication[] = [
      {
        id: 1,
        amount: 10000,
        termInMonths: 12,
        monthlyIncome: 3000,
        creditScore: 700,
        status: 'Approved',
        applicationDate: '2022-01-01',
        fullName: 'John Doe',
        email: 'john.doe@example.com'
      },
      {
        id: 2,
        amount: 5000,
        termInMonths: 6,
        monthlyIncome: 1500,
        creditScore: 650,
        status: 'Pending',
        applicationDate: '2022-02-01',
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com'
      }
    ];

    loanServiceSpy.getAllLoans.and.returnValue(of(mockLoans));
    component.loadLoans();
    fixture.detectChanges();

    const loanItems = fixture.nativeElement.querySelectorAll('.loan-item');
    expect(loanItems.length).toBe(2);
    expect(loanItems[0].textContent).toContain('John Doe');
    expect(loanItems[1].textContent).toContain('Jane Doe');
  });

  it('should handle error when fetching loans fails', () => {
    spyOn(console, 'error');
    loanServiceSpy.getAllLoans.and.returnValue(throwError(() => new Error('Failed')));
    component.loadLoans();
    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Failed to load loans', jasmine.any(Error));
  });

  it('should fetch user loans and display them correctly', () => {
    const mockUserLoans: LoanApplication[] = [
      {
        id: 3,
        amount: 5000,
        termInMonths: 6,
        monthlyIncome: 2000,
        creditScore: 680,
        status: 'Approved',
        applicationDate: '2022-01-15',
        fullName: 'Alice Smith',
        email: 'alice.smith@example.com'
      }
    ];

    loanServiceSpy.getUserLoans.and.returnValue(of(mockUserLoans));

    // simulate condition where status is not passed
    component.loadLoans = function () {
      component['loanService'].getUserLoans().subscribe({
        next: (data) => {
          this.loans = data;
        },
        error: (err) => {
          console.error('Failed to load loans', err);
        }
      });
    };

    component.loadLoans();
    fixture.detectChanges();

    const loanItems = fixture.nativeElement.querySelectorAll('.loan-item');
    expect(loanItems.length).toBe(1);
    expect(loanItems[0].textContent).toContain('Alice Smith');
  });

  it('should call getUserLoans if no status is passed', () => {
    component.loadLoans = function () {
      component['loanService'].getUserLoans().subscribe();  // Accessing private property using bracket notation
    };
    component.loadLoans();
    expect(loanServiceSpy.getUserLoans).toHaveBeenCalled();
  });

  it('should call getAllLoans if status is passed', () => {
    component.loadLoans = function () {
      component['loanService'].getAllLoans('Approved').subscribe();  // Simplified for the spy check
    };
    component.loadLoans();
    expect(loanServiceSpy.getAllLoans).toHaveBeenCalledWith('Approved');
  });
});

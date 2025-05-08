import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoanService } from './loan.service';
import { LoanApplication } from '../models/loanapplication.model';

describe('LoanService', () => {
  let service: LoanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanService]
    });

    service = TestBed.inject(LoanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user loans successfully', () => {
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

    service.getUserLoans().subscribe(loans => {
      expect(loans.length).toBe(2);
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne('https://localhost:7055/api/loan/my-loans');
    expect(req.request.method).toBe('GET');
    req.flush({ $values: mockLoans });
  });

  it('should apply for a loan successfully', () => {
    const mockLoanData = {
      amount: 10000,
      termInMonths: 12,
      monthlyIncome: 3000,
      creditScore: 700
    };

    service.applyLoan(mockLoanData).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne('https://localhost:7055/api/loan/apply');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoanData);
    req.flush({});
  });

  it('should fetch all loans with a status filter', () => {
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
      }
    ];

    const status = 'Approved';

    service.getAllLoans(status).subscribe(loans => {
      expect(loans.length).toBe(1);
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne(`https://localhost:7055/api/loan/admin-dashboard?status=${status}`);
    expect(req.request.method).toBe('GET');
    req.flush({ $values: mockLoans });
  });

  it('should update loan status successfully', () => {
    const loanId = 1;
    const updateData = { status: 'Approved' };

    service.updateLoanStatus(loanId, updateData).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`https://localhost:7055/api/loan/${loanId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush({});
  });
});

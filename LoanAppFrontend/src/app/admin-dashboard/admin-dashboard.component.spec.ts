import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoanService } from '../services/loan.service';
import { of, throwError } from 'rxjs';
import { LoanApplication } from '../models/loanapplication.model';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;

  const mockLoans: LoanApplication[] = [{
    id: 1,
    amount: 10000,
    termInMonths: 12,
    monthlyIncome: 5000,
    creditScore: 700,
    status: 'approved',
    adminRemarks: 'OK',
    applicationDate: '2023-01-01',
    fullName: 'John Doe',
    email: 'john@example.com'
  }];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoanService', ['getAllLoans', 'updateLoanStatus']);

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: LoanService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    loanServiceSpy = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadLoans on ngOnInit', () => {
    loanServiceSpy.getAllLoans.and.returnValue(of(mockLoans));
    component.ngOnInit();
    expect(loanServiceSpy.getAllLoans).toHaveBeenCalled();
    expect(component.loans).toEqual(mockLoans);
  });

  it('should handle non-array response from loadLoans', () => {
    const consoleSpy = spyOn(console, 'error');
    loanServiceSpy.getAllLoans.and.returnValue(of({} as any));
    component.loadLoans();
    expect(consoleSpy).toHaveBeenCalledWith('Expected an array of loans but got:', jasmine.any(Object));
  });

  it('should handle error in loadLoans', () => {
    const consoleSpy = spyOn(console, 'error');
    loanServiceSpy.getAllLoans.and.returnValue(throwError(() => new Error('API error')));
    component.loadLoans();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load loans', jasmine.any(Error));
  });

  it('should toggle isLoading during loadLoans', () => {
    loanServiceSpy.getAllLoans.and.returnValue(of(mockLoans));
    component.loadLoans();
    expect(component.isLoading).toBe(false); // should be false after complete
  });

  it('should apply filterStatus when calling getAllLoans', () => {
    component.filterStatus = 'approved';
    loanServiceSpy.getAllLoans.and.returnValue(of(mockLoans));
    component.loadLoans();
    expect(loanServiceSpy.getAllLoans).toHaveBeenCalledWith('approved');
  });

  it('should call loadLoans on filter change', () => {
    const spyLoadLoans = spyOn(component, 'loadLoans');
    component.onFilterChange();
    expect(spyLoadLoans).toHaveBeenCalled();
  });

  it('should call updateLoanStatus and reload loans on success', () => {
    loanServiceSpy.updateLoanStatus.and.returnValue(of({}));
    const loadLoansSpy = spyOn(component, 'loadLoans');
    component.updateStatus(1, 'approved', 'Looks good');
    expect(loanServiceSpy.updateLoanStatus).toHaveBeenCalledWith(1, {
      status: 'approved',
      adminRemarks: 'Looks good'
    });
    expect(loadLoansSpy).toHaveBeenCalled();
  });

  it('should handle error in updateLoanStatus', () => {
    const consoleSpy = spyOn(console, 'error');
    loanServiceSpy.updateLoanStatus.and.returnValue(throwError(() => new Error('Update error')));
    component.updateStatus(1, 'rejected', 'Insufficient documents');
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update loan', jasmine.any(Error));
  });
});

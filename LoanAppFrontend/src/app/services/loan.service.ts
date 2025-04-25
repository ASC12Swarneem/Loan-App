import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoanApplication } from '../models/loanapplication.model';
import { ApplyLoan } from '../models/apply-loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = "https://localhost:7055/api/loan";  

  constructor(private httpClient: HttpClient) { }

  // Endpoint to fetch user loans (User Dashboard)
  getUserLoans(): Observable<LoanApplication[]> {
    return this.httpClient.get<LoanApplication[]>(`${this.baseUrl}/my-loans`);
  }

  // Endpoint to apply for a loan 
  applyLoan(loanData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/apply`, loanData);
  } 


  updateLoanStatus(id: number, updateData: any): Observable<any> {
    return this.httpClient.put(`https://localhost:7055/api/loan/${id}`, updateData);
  }

  getAllLoans(status?: string): Observable<LoanApplication[]> {
    let params = new HttpParams();

    // Add status as query param if provided
    if (status) {
      params = params.set('status', status); 
    }

    // Ensure correct URL and query parameters are being passed
    return this.httpClient.get<LoanApplication[]>(
      `${this.baseUrl}/admin-dashboard`,
      {
        params,
      }
    );
  }
}

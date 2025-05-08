import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoanApplication } from '../models/loanapplication.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = "https://localhost:7055/api/loan";  

  constructor(private httpClient: HttpClient) { }

  getUserLoans(): Observable<LoanApplication[]> {
    return this.httpClient.get<any>(`${this.baseUrl}/my-loans`).pipe(
      map(response => response.$values || []) 
    );
  }

  applyLoan(loanData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/apply`, loanData);
  } 

  getAllLoans(status?: string): Observable<LoanApplication[]> {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status); 
    }

    return this.httpClient.get<any>(`${this.baseUrl}/admin-dashboard`, { params })
      .pipe(map(response => response.$values || []));  
  }

  updateLoanStatus(id: number, updateData: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, updateData);
  }
}

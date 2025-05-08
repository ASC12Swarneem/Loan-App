import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Register } from '../models/register.model';
import { Observable, tap } from 'rxjs';
import { Login } from '../models/login.model';
import { LoginResponse } from '../models/loginresponse.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7055/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(data: Register): Observable<Register> {
    return this.http.post<Register>(`${this.baseUrl}/register`, data);
  }
  login(credentials: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId.toString());
  
        this.router.navigate(['/user-dashboard']);
      })
    );
  }
  
  

  

  logout(){
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); 
  }

  isloggedIn(): boolean{
    return !!localStorage.getItem('token'); 
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

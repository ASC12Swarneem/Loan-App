import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: RouterMock;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    router = new RouterMock();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, RecaptchaModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: router }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit form if it is invalid', () => {
    spyOn(window, 'alert');

    component.loginForm.setValue({
      email: '',
      password: ''
    });

    component.Login();

    expect(window.alert).toHaveBeenCalledWith('Please fill in the form correctly.');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should display an error if login fails', fakeAsync(() => {
    spyOn(window, 'alert');
    const mockError = new Error('Invalid credentials');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    authServiceSpy.login.and.returnValue(throwError(() => mockError));

    component.Login();
    tick(); 

    expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(window.alert).toHaveBeenCalledWith('Login Failed');
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should redirect to admin dashboard on successful login for Admin', fakeAsync(() => {
    const mockResponse = {
      token: 'mock-token',
      role: 'Admin',
      userId: 1
    };

    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      window.localStorage.setItem(key, value);
    });

    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'admin123'
    });

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.Login();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(localStorage.getItem('role')).toBe('Admin');
    expect(localStorage.getItem('userId')).toBe('1');
    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  }));

  it('should redirect to user dashboard on successful login for User', fakeAsync(() => {
    const mockResponse = {
      token: 'mock-token',
      role: 'User',
      userId: 2
    };

    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      window.localStorage.setItem(key, value);
    });

    component.loginForm.setValue({
      email: 'user@example.com',
      password: 'user123'
    });

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.Login();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(localStorage.getItem('role')).toBe('User');
    expect(localStorage.getItem('userId')).toBe('2');
    expect(router.navigate).toHaveBeenCalledWith(['/user-dashboard']);
  }));
});

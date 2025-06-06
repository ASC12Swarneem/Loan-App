import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Register } from '../models/register.model';
import { Login } from '../models/login.model';
import { LoginResponse } from '../models/loginresponse.model';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the register API and send correct data', () => {
    const mockRegisterData: Register = {
      fullName: 'John Doe',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'User'
    };

    service.register(mockRegisterData).subscribe();

    const req = httpMock.expectOne('https://localhost:7055/api/Auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterData);
    req.flush(mockRegisterData);
  });

  it('should call login API, store values in localStorage, and navigate to dashboard', () => {
    const mockLoginData: Login = {
      email: 'test@test.com',
      password: 'password',
      captchaToken: 'captcha-response'
    };

    const mockResponse: LoginResponse = {
      token: 'test-token',
      role: 'User',
      userId: 42
    };

    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

    service.login(mockLoginData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(setItemSpy).toHaveBeenCalledWith('token', mockResponse.token);
      expect(setItemSpy).toHaveBeenCalledWith('role', mockResponse.role);
      expect(setItemSpy).toHaveBeenCalledWith('userId', mockResponse.userId.toString());
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-dashboard']);
    });

    const req = httpMock.expectOne('https://localhost:7055/api/Auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should remove token and role from localStorage on logout', () => {
    const removeItemSpy = spyOn(localStorage, 'removeItem');

    service.logout();

    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(removeItemSpy).toHaveBeenCalledWith('role');
  });

  it('should return true if token exists in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
    expect(service.isloggedIn()).toBeTrue();
  });

  it('should return false if no token in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(service.isloggedIn()).toBeFalse();
  });

  it('should return role from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('Admin');
    expect(service.getRole()).toBe('Admin');
  });

  it('should return token from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('test-token');
    expect(service.getToken()).toBe('test-token');
  });
});

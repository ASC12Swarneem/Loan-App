import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs'; 
import { Register } from '../models/register.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        HttpClientTestingModule,
        RecaptchaModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onCaptchaResolved and log error when captcha response is null', () => {
    spyOn(console, 'error');
    component.onCaptchaResolved(null);
    expect(console.error).toHaveBeenCalledWith('Captcha response is null');
  });

  it('should call onCaptchaResolved when captcha is resolved', () => {
    spyOn(console, 'error');
    component.onCaptchaResolved('validCaptchaResponse');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should not submit form when form is invalid', () => {
    component.registerForm.controls['fullName'].setValue('');
    component.registerForm.controls['email'].setValue('');
    component.registerForm.controls['password'].setValue('');
    component.registerForm.controls['confirmPassword'].setValue('');

    component.Register();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call AuthService.register when form is valid and captcha is resolved', () => {
    const mockResponse: Register = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'User'
    };

    component.registerForm.controls['fullName'].setValue(mockResponse.fullName);
    component.registerForm.controls['email'].setValue(mockResponse.email);
    component.registerForm.controls['password'].setValue(mockResponse.password);
    component.registerForm.controls['confirmPassword'].setValue(mockResponse.confirmPassword);

    spyOn(console, 'log');
    authServiceSpy.register.and.returnValue(of(mockResponse));

    component.Register();

    expect(authServiceSpy.register).toHaveBeenCalledWith(component.registerForm.value);
    expect(console.log).toHaveBeenCalledWith('Registered!', mockResponse);
  });

  it('should log error when registration fails', () => {
    const mockError = new Error('Registration failed');

    component.registerForm.controls['fullName'].setValue('John Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password123');

    authServiceSpy.register.and.returnValue(throwError(() => mockError));
    spyOn(console, 'error');

    component.Register();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Registration failed', mockError);
  });
});

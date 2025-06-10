import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent implements OnInit {
[x: string]: any;
  loginForm!: FormGroup;
  isLoading: boolean = false;
  falseCredentials: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      captchaToken: ['', Validators.required]
    });
  }

  onCaptchaResolved(token: string | null): void {
    if (token) {
      console.log('Captcha resolved with response:', token);
      this.loginForm.patchValue({ captchaToken: token }); 
    } else {
      console.warn('Captcha resolution returned null');
    }
  }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      captchaToken: ['', Validators.required] 
    });
  }

  Login(): void {
  if (this.loginForm.invalid) {
    alert('Please fill in the form correctly.');
    return;
  }

  this.isLoading = true;
  this.falseCredentials = false;

  this.authService.login(this.loginForm.value).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.falseCredentials = false;
      console.log("Logged in Successfully!", res);

      const route = res.role === 'Admin' ? '/admin-dashboard' : '/user-dashboard';
      this.router.navigate([route]);
    },
    error: (err) => {
      this.isLoading = false;
      this.falseCredentials = true;
      console.log("Login Failed", err);
    }
  });
}
}

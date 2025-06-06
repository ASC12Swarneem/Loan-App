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

    console.log('Login payload:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log("Logged in Successfully!", res);
        if (res.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        console.log("Login Failed", err);
      }
    });
  }
}

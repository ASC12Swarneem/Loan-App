import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private autService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  onCaptchaResolved(captchaResponse: string | null) {
    if (captchaResponse) {
    } else {
        console.error('Captcha response is null');
    }
  }
  

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        
      })
  }

  Login(){
    if(this.loginForm.invalid){
      return;
    }


    this.autService.login(this.loginForm.value).subscribe({
      next: res => {
        console.log("Logged in Successfully!", res);
    
        // Role-based routing
        if (res.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: err => {
        console.log("Login Failed", err);
      }
    });
    
    // this.autService.login(this.loginForm.value).subscribe({
    //   next: res =>{
    //     console.log("Logged in Successfully!", res);
    //     this.router.navigate(['/user-dashboard']);

    //   },

    //   error: err =>{
    //     console.log("Login Failed", err);
    //   }
    // })
  }
}

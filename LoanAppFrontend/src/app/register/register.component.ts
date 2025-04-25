import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService){

  }

  ngOnInit(): void {
      this.registerForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['User'] // Default role is User
      },{
      validator: this.passwordMatchValidator
  });
  }
  

  passwordMatchValidator(formGroup: FormGroup): null | {mismatch: true} {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  captchaResolved = false;
captchaToken: string = '';

onCaptchaResolved(captchaResponse: string | null) {
  if (captchaResponse) {
  } else {
      console.error('Captcha response is null');
  }
}


  Register(){
    if(this.registerForm.invalid){
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: res => console.log('Registered!', res),
      error: err => console.error('Registration failed', err)
    });
  }
}

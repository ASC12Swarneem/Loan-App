import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { RecaptchaModule } from 'ng-recaptcha'; // ✅ Correct import
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        HttpClientTestingModule,
        RecaptchaModule,
        ReactiveFormsModule
      ],
      providers: [AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Optional if RecaptchaModule is properly imported
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { RegisterComponent } from './register.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { AuthService } from '../services/auth.service';
// import { RecaptchaComponent } from 'ng-recaptcha';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// describe('RegisterComponent', () => {
//   let component: RegisterComponent;
//   let fixture: ComponentFixture<RegisterComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [RegisterComponent],
//       imports: [HttpClientTestingModule, RecaptchaComponent],
//       providers: [AuthService],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(RegisterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLoanComponent } from './apply-loan.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('ApplyLoanComponent', () => {
  let component: ApplyLoanComponent;
  let fixture: ComponentFixture<ApplyLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplyLoanComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

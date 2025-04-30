import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansListComponent } from './loans-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { RegisterComponent } from '../register/register.component';
import { RecaptchaModule } from 'ng-recaptcha';

describe('LoansListComponent', () => {
  let component: LoansListComponent;
  let fixture: ComponentFixture<LoansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoansListComponent, RegisterComponent],
      imports: [HttpClientTestingModule, RecaptchaModule],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

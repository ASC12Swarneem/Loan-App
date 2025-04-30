import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { AuthGuard } from '../guards/auth.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      imports: [HttpClientTestingModule, RecaptchaModule],
      providers: [AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

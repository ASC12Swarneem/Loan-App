import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardComponent } from './user-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDashboardComponent]
,     imports: [HttpClientTestingModule],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

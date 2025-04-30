import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';


describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

  import { TestBed } from '@angular/core/testing';

  import { LoanService } from './loan.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

  describe('LoanService', () => {
    let service: LoanService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [LoanService]
      });
      service = TestBed.inject(LoanService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

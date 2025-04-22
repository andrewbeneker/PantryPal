import { TestBed } from '@angular/core/testing';

import { FoodstatsService } from './foodstats.service';

describe('FoodstatsService', () => {
  let service: FoodstatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodstatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

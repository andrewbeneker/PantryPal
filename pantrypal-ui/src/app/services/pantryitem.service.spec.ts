import { TestBed } from '@angular/core/testing';

import { PantryitemService } from './pantryitem.service';

describe('PantryitemService', () => {
  let service: PantryitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantryitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

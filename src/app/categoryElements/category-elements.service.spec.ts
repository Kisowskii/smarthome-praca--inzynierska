import { TestBed } from '@angular/core/testing';

import { CategoryElementsService } from './category-elements.service';

describe('CategoryElementsService', () => {
  let service: CategoryElementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryElementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SearchItem } from './search-item';

describe('SearchItem', () => {
  let service: SearchItem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDispay } from './search-dispay';

describe('SearchDispay', () => {
  let component: SearchDispay;
  let fixture: ComponentFixture<SearchDispay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchDispay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDispay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Views } from './views';

describe('Views', () => {
  let component: Views;
  let fixture: ComponentFixture<Views>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Views]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Views);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

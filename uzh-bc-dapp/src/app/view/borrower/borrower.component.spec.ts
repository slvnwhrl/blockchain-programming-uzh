import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerComponent } from './borrower.component';

describe('BorrowerComponent', () => {
  let component: BorrowerComponent;
  let fixture: ComponentFixture<BorrowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

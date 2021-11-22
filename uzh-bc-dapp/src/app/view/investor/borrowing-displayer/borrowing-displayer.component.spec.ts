import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowingDisplayerComponent } from './borrowing-displayer.component';

describe('BorrowingDisplayerComponent', () => {
  let component: BorrowingDisplayerComponent;
  let fixture: ComponentFixture<BorrowingDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowingDisplayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowingDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

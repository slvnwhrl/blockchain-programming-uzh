import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentDisplayerComponent } from './investment-displayer.component';

describe('InvestmentDisplayerComponent', () => {
  let component: InvestmentDisplayerComponent;
  let fixture: ComponentFixture<InvestmentDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentDisplayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

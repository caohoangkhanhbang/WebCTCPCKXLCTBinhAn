import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountUp } from './count-up';

describe('CountUp', () => {
  let component: CountUp;
  let fixture: ComponentFixture<CountUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountUp],
    }).compileComponents();

    fixture = TestBed.createComponent(CountUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

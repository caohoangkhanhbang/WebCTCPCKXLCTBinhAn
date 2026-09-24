import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongQuan } from './tong-quan';

describe('TongQuan', () => {
  let component: TongQuan;
  let fixture: ComponentFixture<TongQuan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TongQuan],
    }).compileComponents();

    fixture = TestBed.createComponent(TongQuan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

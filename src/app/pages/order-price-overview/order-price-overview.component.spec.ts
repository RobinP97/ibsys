import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPriceOverviewComponent } from './order-price-overview.component';

describe('OrderPriceOverviewComponent', () => {
  let component: OrderPriceOverviewComponent;
  let fixture: ComponentFixture<OrderPriceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderPriceOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPriceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

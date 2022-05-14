import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlanningComponent } from './order-planning.component';

describe('OrderPlanningComponent', () => {
  let component: OrderPlanningComponent;
  let fixture: ComponentFixture<OrderPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

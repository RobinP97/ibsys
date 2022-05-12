import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarPlanningComponent } from './nav-bar-planning.component';

describe('NavBarPlanningComponent', () => {
  let component: NavBarPlanningComponent;
  let fixture: ComponentFixture<NavBarPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBarPlanningComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

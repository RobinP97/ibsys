import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectsalesComponent } from './directsales.component';

describe('DirectsalesComponent', () => {
  let component: DirectsalesComponent;
  let fixture: ComponentFixture<DirectsalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectsalesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectsalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

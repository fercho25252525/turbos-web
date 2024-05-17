import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOrderComponent } from './status-order.component';

describe('StatusOrderComponent', () => {
  let component: StatusOrderComponent;
  let fixture: ComponentFixture<StatusOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusOrderComponent]
    });
    fixture = TestBed.createComponent(StatusOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

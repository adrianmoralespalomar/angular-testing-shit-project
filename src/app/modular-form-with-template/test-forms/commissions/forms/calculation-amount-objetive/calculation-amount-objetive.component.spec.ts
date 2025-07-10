/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CalculationAmountObjetiveComponent } from './calculation-amount-objetive.component';

describe('CalculationAmountObjetiveComponent', () => {
  let component: CalculationAmountObjetiveComponent;
  let fixture: ComponentFixture<CalculationAmountObjetiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculationAmountObjetiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationAmountObjetiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

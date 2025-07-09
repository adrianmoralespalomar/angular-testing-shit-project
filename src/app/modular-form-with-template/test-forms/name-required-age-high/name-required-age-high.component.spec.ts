/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NameRequiredAgeHighComponent } from './name-required-age-high.component';

describe('NameRequiredAgeHighComponent', () => {
  let component: NameRequiredAgeHighComponent;
  let fixture: ComponentFixture<NameRequiredAgeHighComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameRequiredAgeHighComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameRequiredAgeHighComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

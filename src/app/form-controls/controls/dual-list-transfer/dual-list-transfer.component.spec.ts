/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DualListTransferComponent } from './dual-list-transfer.component';

describe('DualListTransferComponent', () => {
  let component: DualListTransferComponent;
  let fixture: ComponentFixture<DualListTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DualListTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DualListTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

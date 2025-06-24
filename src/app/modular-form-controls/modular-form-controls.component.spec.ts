/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularFormControlsComponent } from './modular-form-controls.component';

describe('ModularFormControlsComponent', () => {
  let component: ModularFormControlsComponent;
  let fixture: ComponentFixture<ModularFormControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModularFormControlsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularFormControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

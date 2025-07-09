import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { GeneralDataFormComponent } from './forms/general-data-form/general-data-form.component';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [GeneralDataFormComponent, ReactiveFormsModule, JsonPipe, MatButtonModule],
  template: `
    <form [formGroup]="this.formCommission">
      <app-general-data-form formGroupName="generaldata" />
    </form>
    <pre>{{ this.formCommission.getRawValue() | json }}</pre>
    <button mat-raised-button color="accent" [disabled]="this.formCommission.invalid">Save</button>
  `,
})
export class CommissionsComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected formCommission = this.formBuilder.group({
    generaldata: this.formBuilder.group({}),
  });

  ngOnInit() {}
}

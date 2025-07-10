import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Commission } from './api/models/commission';
import { CommissionsService } from './api/services/commissions.service';
import { CalculationAmountObjetiveComponent } from './forms/calculation-amount-objetive/calculation-amount-objetive.component';
import { GeneralDataFormComponent } from './forms/general-data-form/general-data-form.component';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [GeneralDataFormComponent, CalculationAmountObjetiveComponent, ReactiveFormsModule, JsonPipe, MatButtonModule],
  template: `
    <form [formGroup]="this.formCommission">
      <app-general-data-form formGroupName="generaldata" [commissionToEdit]="this.commissionToEdit" />
      <app-calculation-amount-objetive formGroupName="calcAmountObjective" [commissionToEdit]="this.commissionToEdit" />
    </form>
    <pre>{{ this.formCommission.getRawValue() | json }}</pre>
    <button mat-raised-button color="accent" [disabled]="this.formCommission.invalid">Save</button>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `,
  ],
})
export class CommissionsComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly commissionsService = inject(CommissionsService);
  protected commissionToEdit: Commission | undefined = undefined;
  protected formCommission = this.formBuilder.group({
    generaldata: this.formBuilder.group({}),
    calcAmountObjective: this.formBuilder.group({}),
  });

  ngOnInit() {
    this.getCommissionData();
  }

  getCommissionData() {
    this.commissionsService.getCommissionData().subscribe({
      next: (resp) => {
        this.commissionToEdit = resp;
      },
    });
  }
}

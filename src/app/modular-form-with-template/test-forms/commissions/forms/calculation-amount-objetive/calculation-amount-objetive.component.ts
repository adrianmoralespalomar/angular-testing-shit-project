import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { buildForm, patchFormWithApiData } from 'src/app/modular-form-with-template/dynamic-form/config/build-form';
import { DynamicFormComponent } from 'src/app/modular-form-with-template/dynamic-form/dynamic-form.component';
import { Commission } from '../../api/models/commission';
import { CALC_AMOUNT_OBJETIVES_FORM } from './calculation-amount-objetive-form';

@Component({
  selector: 'app-calculation-amount-objetive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DynamicFormComponent],
  template: `
    <form [formGroup]="form" *ngIf="form">
      <app-dynamic-form [form]="form" [rules]="calc_amount_rules" [title]="'Calculo del Importe Objetivo'" />
    </form>
  `,
})
export class CalculationAmountObjetiveComponent implements OnInit, OnChanges {
  @Input() commissionToEdit: Commission | undefined;
  private readonly formBuilder = inject(FormBuilder);
  private readonly formGroupDirective = inject(FormGroupDirective);
  protected readonly calc_amount_rules = CALC_AMOUNT_OBJETIVES_FORM;
  protected form!: FormGroup;

  ngOnInit() {
    this.form = buildForm(this.formBuilder, CALC_AMOUNT_OBJETIVES_FORM, 'calcAmountObjective', this.formGroupDirective);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['commissionToEdit'] && this.commissionToEdit) {
      this.patchForm();
    }
  }

  patchForm(): void {
    patchFormWithApiData(this.form, this.commissionToEdit, CALC_AMOUNT_OBJETIVES_FORM);
  }

  // utilidades para la plantilla, si las necesitas
  campoVisible(path: string) {
    return !this.form.get(path)!.disabled;
  }

  isMandatoryField = (key: string) => this.form.get([key])?.errors?.['required'] ?? false;
}

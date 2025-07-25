import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { buildForm, patchFormWithApiData } from 'src/app/modular-form-with-template/dynamic-form/config/build-form';
import { DynamicFormComponent } from 'src/app/modular-form-with-template/dynamic-form/dynamic-form.component';
import { Commission } from '../../api/models/commission';
import { GENERAL_DATA_FORM } from './general-data-form';

@Component({
  selector: 'app-general-data-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DynamicFormComponent],
  template: `
    <form [formGroup]="form" class="name-required-age-high" *ngIf="form">
      <app-dynamic-form [form]="form" [rules]="client_rules" [title]="'Datos Generales'" />
    </form>
  `,
})
export class GeneralDataFormComponent implements OnInit, OnChanges {
  @Input() commissionToEdit: Commission | undefined;
  private readonly formBuilder = inject(FormBuilder);
  private readonly formGroupDirective = inject(FormGroupDirective);
  protected readonly client_rules = GENERAL_DATA_FORM;
  protected form!: FormGroup;

  ngOnInit() {
    this.form = buildForm(this.formBuilder, GENERAL_DATA_FORM, 'generaldata', this.formGroupDirective);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['commissionToEdit'] && this.commissionToEdit) {
      this.patchForm();
    }
  }

  patchForm(): void {
    patchFormWithApiData(this.form, this.commissionToEdit, GENERAL_DATA_FORM);
  }

  // utilidades para la plantilla, si las necesitas
  campoVisible(path: string) {
    return !this.form.get(path)!.disabled;
  }

  isMandatoryField = (key: string) => this.form.get([key])?.errors?.['required'] ?? false;
}

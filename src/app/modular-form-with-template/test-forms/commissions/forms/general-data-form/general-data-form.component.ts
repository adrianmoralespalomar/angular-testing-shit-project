import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { buildForm } from 'src/app/modular-form-with-template/dynamic-form/config/build-form';
import { DynamicFormComponent } from 'src/app/modular-form-with-template/dynamic-form/dynamic-form.component';
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
export class GeneralDataFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly formGroupDirective = inject(FormGroupDirective);
  protected readonly client_rules = GENERAL_DATA_FORM;
  protected form!: FormGroup;

  ngOnInit() {
    this.form = buildForm(this.formBuilder, GENERAL_DATA_FORM, 'generaldata', this.formGroupDirective);
  }

  // utilidades para la plantilla, si las necesitas
  campoVisible(path: string) {
    return !this.form.get(path)!.disabled;
  }

  isMandatoryField = (key: string) => this.form.get([key])?.errors?.['required'] ?? false;
}

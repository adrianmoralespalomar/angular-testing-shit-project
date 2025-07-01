import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from '../form-controls/controls/input-text/input-text.component';
import { buildForm } from './dynamic-form/config/build-form';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { CLIENT_FORM } from './forms/clients-form';

@Component({
  standalone: true,
  selector: 'app-modular-form-with-template',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextComponent, DynamicFormComponent],
  templateUrl: './modular-form-with-template.component.html',
  styleUrls: ['./modular-form-with-template.component.css'],
})
export class ModularFormWithTemplateComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly client_rules = CLIENT_FORM;
  form = buildForm(this.formBuilder, CLIENT_FORM);

  // utilidades para la plantilla, si las necesitas
  campoVisible(path: string) {
    return !this.form.get(path)!.disabled;
  }

  isMandatoryField = (key: string) => this.form.get([key])?.errors?.['required'] ?? false;
}

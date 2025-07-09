import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { buildForm } from 'src/app/modular-form-controls/config/build-form';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { NAME_REQUIRED_AGE_HIGH } from './name-required-age-high-form';

@Component({
  selector: 'app-name-required-age-high',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DynamicFormComponent],
  templateUrl: './name-required-age-high.component.html',
  styleUrls: ['./name-required-age-high.component.css'],
})
export class NameRequiredAgeHighComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly client_rules = NAME_REQUIRED_AGE_HIGH;
  form = buildForm(this.formBuilder, NAME_REQUIRED_AGE_HIGH);

  // utilidades para la plantilla, si las necesitas
  campoVisible(path: string) {
    return !this.form.get(path)!.disabled;
  }

  isMandatoryField = (key: string) => this.form.get([key])?.errors?.['required'] ?? false;
}

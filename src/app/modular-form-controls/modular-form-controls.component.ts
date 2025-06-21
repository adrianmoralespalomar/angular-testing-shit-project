import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberComponent } from '../form-controls/controls/input-number/input-number.component';
import { InputTextComponent } from '../form-controls/controls/input-text/input-text.component';
import { buildForm } from './config/build-form';
import { CLIENT_FORM } from './forms/clients-form';

@Component({
  standalone: true,
  selector: 'app-modular-form-controls',
  templateUrl: './modular-form-controls.component.html',
  styleUrls: ['./modular-form-controls.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextComponent, InputNumberComponent],
})
export class ModularFormControlsComponent {
  private readonly formBuilder = inject(FormBuilder);
  form = buildForm(this.formBuilder, CLIENT_FORM);

  // utilidades para la plantilla, si las necesitas
  campoVisible(path: string) {
    return !this.form.get(path)!.disabled;
  }

  isMandatoryField = (key: string) => this.form.get([key])?.errors?.['required'] ?? false;
}

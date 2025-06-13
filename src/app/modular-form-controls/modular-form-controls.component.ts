import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { buildForm } from './build-form';
import { CLIENTE_RULES } from './client-rules';

@Component({
  standalone:true,
  selector: 'app-modular-form-controls',
  templateUrl: './modular-form-controls.component.html',
  styleUrls: ['./modular-form-controls.component.css'],
  imports: [ CommonModule, ReactiveFormsModule,FormsModule],
})
export class ModularFormControlsComponent{
  private readonly formBuilder = inject(FormBuilder)
  form = buildForm(this.formBuilder, CLIENTE_RULES);

  // utilidades para la plantilla, si las necesitas
  campoVisible(path: string) {
    return !this.form.get(path)!.disabled;
  }

  isMandatoryField = (key:string) => this.form.get([key])?.errors?.['required'] ?? false

  constructor(private fb: FormBuilder) {}

}

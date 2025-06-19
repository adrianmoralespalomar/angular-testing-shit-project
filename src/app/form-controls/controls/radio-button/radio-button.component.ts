import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

export interface RadioButtonOptions{
  label:string;
  value:any;
}

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent implements ControlValueAccessor {
  /** Etiqueta (titulo) que aparece encima del grupo */
  @Input() label?: string;
  /** Opciones a pintar: [{ label:'Sí', value:true }, { label:'No', value:false }] */
  @Input() options: RadioButtonOptions[] = [];
  /** Layout del grupo */
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  /** Deshabilitado ajeno al propio FormControl  */
  @Input() externalDisabled = false;
  /** Uso fuera de formularios: valor externo */
  @Input() externalValue: any = null;
  value: any = null;
  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }


  /** El componente está dentro de un form -> hay control */
  get isFormBound(): boolean {
    return !!this.ngControl?.control;
  }

  get control() {
    return this.ngControl?.control;
  }

  get isDisabled(): boolean {
    return this.control?.disabled ?? false;
  }

  get isRequired(): boolean {
    return !!this.control?.validator?.({} as any)?.['required'];
  }

  get showError(): boolean {
    return (this.control?.invalid && (this.control.touched || this.control.dirty)) || false;
  }

  get errorMessage(): string | null {
    const errors = this.control?.errors;
    if (!errors) return null;
    if (errors['required']) return 'Este campo es obligatorio';
    // Añade aquí más errores custom si los necesitas
    return 'Valor inválido';
  }


  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Angular ya gestiona el estado disabled del control
  }

  /* ---------- HANDLERS ---------- */
  onSelectionChange(val: any) {
    if (this.isDisabled || this.externalDisabled) return;
    this.value = val;
    this.onChange(val);
    this.externalValue = val;
  }

}

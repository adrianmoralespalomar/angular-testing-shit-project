import { NgClass, NgIf } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [ NgIf, NgClass, MatFormFieldModule, MatInputModule],
  templateUrl: './input-text.component.html',
  styleUrls: ['../input.css']
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() maxlength?: number;
  @Input() showCharCount = false;
  @Input() allowTypeInvalidValue = false; //Esto es para que el formcontrol permita escribir valores incorrectos y entonces mostrar el mensaje de error. Si es "true", entonces evitamos q el usuario pueda escribir valores incorrectos

  // ✅ Inputs para uso fuera del formulario
  @Input() externalValue: string = '';
  @Input() isReadonly: boolean = false;
  @Input() externalDisabled: boolean = false;

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  // Saber si se está usando en un formulario o no
  get isFormBound(): boolean {
    return !!this.ngControl?.control;
  }
  
  get control() {
    return this.ngControl?.control;
  }

  get isRequired(): boolean {
    return !!this.control?.validator?.({} as any)?.['required'];
  }

  get isDisabled(): boolean {
    return this.control?.disabled ?? false;
  }

  get currentLength(): number {
    return (this.isFormBound ? this.value : this.externalValue)?.length ?? 0;
  }

  get showError(): boolean | undefined{
    return this.control?.invalid && (this.control.touched || this.control.dirty) || false;
  }

  getMaxLength():number | undefined{
    if(this.allowTypeInvalidValue) return;
    //Si le pasamos directamente el maxlength, entonces lo seteamos
    if(this.maxlength) return this.maxlength;
    //Sino, leeremos desde el Validators.minLength del FormControl
    const validator = this.control?.validator;
    if (!validator) return undefined;
    // Creamos un control ficticio con un valor muy alto que siempre va a fallar si hay un max
    const result = validator({ value: 'x'.repeat(9999999) } as any);
    if (result && typeof result === 'object' && 'maxlength' in result) {
      return result['maxlength'].requiredLength;
    }
    return undefined;
  }

  get errorMessage(): string | null {
    const errors = this.control?.errors;
    if (!errors) return null;
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['maxlength']) return 'Longitud máxima superada';
    //if (errors['invalidEmail']) return errors['invalidEmail'].message ?? 'Email inválido';
    for (const key in errors) { //Devuelve el primer error custom
      const err = errors[key];
      if (typeof err === 'object' && 'message' in err) {
        return err.message;
      }
    }
    return 'Campo inválido';
  }

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // control.disabled ya lo gestiona Angular
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.externalValue = this.value; // sincroniza si es usado fuera
  }
}

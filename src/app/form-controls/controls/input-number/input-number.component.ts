import { NgClass, NgIf } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [ ReactiveFormsModule,NgIf, NgClass, MatFormFieldModule, MatInputModule,NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './input-number.component.html',
  styleUrls: ['../input.css']
})
export class InputNumberComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() maxdecimals: number = 0;
  @Input() typeNumber : 'amount' | 'percentage' = 'amount';
 
  // ✅ Inputs para uso fuera del formulario
  @Input() externalValue: number | null = null;
  @Input() isReadonly: boolean = false;
  @Input() externalDisabled: boolean = false;

  //Se utiliza un FormControl porque asi podemos trabajar con value:number y los forms que utilicen este componente, no tendran que transformar el string a number.
  //Si no usaramos un FormControl + ngx-mask, el valor siempre seria string y entonces en cada formcontrol, al hacer la peticion tendriamos q transformar ese string en un number etc etc
  ngxMaskControl = new FormControl();

  value: number | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
    //Set Initial Value for ngxMaskControl
    setTimeout(()=>{
      this.ngxMaskControl.setValue(Number(this.isFormBound ? this.value : this.externalValue));
      if(this.isDisabled || this.externalDisabled){
        this.ngxMaskControl.disable();
        this.ngxMaskControl.updateValueAndValidity();
      }
    });
  }

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

  get showError(): boolean | undefined{
    return this.control?.invalid && (this.control.touched || this.control.dirty) || false;
  }

  getMaxvalue(): number | undefined{
    const validator = this.control?.validator;
    if (!validator) return undefined;
    // Creamos un control ficticio con un valor muy alto que siempre va a fallar si hay un max
    const testValue = 999999999;
    const result = validator({ value: testValue } as any);
    if (result && typeof result === 'object' && 'max' in result) {
      return result['max'].max;
    }
    return undefined;
  }

  getMinvalue(): number | undefined{
    const validator = this.control?.validator;
    if (!validator) return undefined;
    // Creamos un control ficticio con un valor muy alto que siempre va a fallar si hay un max
    const testValue = -999999999;
    const result = validator({ value: testValue } as any);
    if (result && typeof result === 'object' && 'min' in result) {
      return result['min'].min;
    }
    return undefined;
  }

  get errorMessage(): string | null {
    const errors = this.control?.errors;
    if (!errors) return null;
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['maxlength']) return 'Longitud máxima superada';
    if (errors['max']) return `Valor debe ser menor o igual a ${this.getMaxvalue()}`;
    if (errors['min']) return `Valor debe ser mayor o igual a ${this.getMinvalue()}`;
    for (const key in errors) { //Devuelve el primer error custom
      const err = errors[key];
      if (typeof err === 'object' && 'message' in err) {
        return err.message;
      }
    }
    return 'Campo inválido';
  }

  writeValue(value: any): void {
    this.value = value ?? null;
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
    this.value = this.ngxMaskControl.value;
    this.onChange(this.value);
    this.externalValue = this.value;
  }
  
}

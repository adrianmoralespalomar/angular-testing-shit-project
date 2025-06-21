import { NgClass, NgIf } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { getErrorMessage, getMaxDecimals, getMaxvalue, getMinvalue } from '../shared-functions';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [ ReactiveFormsModule,NgIf, NgClass,NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './input-number.component.html',
  styleUrls: ['../input.css']
})
export class InputNumberComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() maxdecimals?: number;
  @Input() typeNumber : 'amount' | 'percentage' = 'amount';
  @Input() allowTypeInvalidValue = false; //Esto es para que el formcontrol permita escribir valores incorrectos y entonces mostrar el mensaje de error. Si es "true", entonces evitamos q el usuario pueda escribir valores incorrec 
 
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
    return getMaxvalue(this.control);
  }

  getMinvalue(): number | undefined{
    return getMinvalue(this.control);
  }

  getMaxDecimals(): number | undefined{
    return getMaxDecimals(this.control, this.maxdecimals);
  }

  get errorMessage(): string | null {
    return getErrorMessage(this.control);
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

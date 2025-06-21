import { NgClass, NgIf } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { getErrorMessage, getMaxLength } from '../shared-functions';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [ NgIf, NgClass],
  templateUrl: './textarea.component.html',
  styleUrls: ['../input.css']
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() maxlength?: number;
  @Input() showCharCount = false;
  @Input() allowTypeInvalidValue = false; //Esto es para que el formcontrol permita escribir valores incorrectos y entonces mostrar el mensaje de error. Si es "true", entonces evitamos q el usuario pueda escribir valores incorrec 

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
    return getMaxLength(this.control, this.maxlength)
  }

  get errorMessage(): string | null {
    return getErrorMessage(this.control, this.maxlength)
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

import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { getErrorMessage } from '../shared-functions';
import { SelectOption } from './select-option-interface';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgIf, NgClass, NgFor],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css', '../input.css'],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() options: SelectOption[] = [];

  // ✅ Inputs para uso fuera del formulario
  @Input() externalValue: string | number | boolean | null | undefined = null;
  @Input() isReadonly: boolean = false;
  @Input() externalDisabled: boolean = false;

  value: string | number | boolean | null | undefined = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
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

  get showError(): boolean | undefined {
    return (this.control?.invalid && (this.control.touched || this.control.dirty)) || false;
  }

  get errorMessage(): string | null {
    return getErrorMessage(this.control);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Angular gestiona el estado disabled
  }

  onSelectChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    // Buscar el valor original en el array de opciones
    const matchedOption = this.options.find((opt) => String(opt.value) === selectedValue);
    this.value = matchedOption?.value ?? null;
    this.onChange(this.value);
    this.externalValue = this.value;
  }

  clearSelection() {
    this.value = null;
    this.externalValue = null;
    this.onChange(null);
  }
}

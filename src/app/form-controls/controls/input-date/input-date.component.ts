import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { getErrorMessage } from '../shared-functions';

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.css','../input.css']
})
export class InputDateComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: 'single' | 'range' = 'single'; // modo de fecha única o rango
  @Input() isReadonly: boolean = false;
  @Input() externalDisabled: boolean = false;
  @Input() externalValue: string | { from: string; to: string } | null = null;

  value: any = null; // Date o { from, to }
  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  get control() {
    return this.ngControl?.control;
  }

  get isFormBound(): boolean {
    return !!this.ngControl?.control;
  }

  get isDisabled(): boolean {
    return this.control?.disabled ?? false;
  }

  get isRequired(): boolean {
    return !!this.control?.validator?.({} as any)?.['required'];
  }

  get showError(): boolean {
    return !!this.control?.invalid && (this.control.touched || this.control.dirty);
  }

  get errorMessage(): string | null {
    return getErrorMessage(this.control);
  }

  getDateFormat(value: Date | null, isVisualFormat:boolean): string | null {
    if (!value) return null;
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return isVisualFormat ? `${year}/${month}/${day}` : `${year}-${month}-${day}`;
  }

  writeValue(value: any): void {
    this.value = value ?? (this.type === 'range' ? { from: null, to: null } : null);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  onSingleDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const date = input.valueAsDate;
    this.value = date;
    const formatted = this.getDateFormat(date, false); // yyyy-MM-dd
    this.externalValue = formatted;
    this.onChange(formatted);
  }

  onFromDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const from = input.value ? new Date(input.value) : null;
    this.value = { ...this.value, from };
    this.externalValue = this.value;
    this.onChange(this.value);
  }

  onToDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const to = input.value ? new Date(input.value) : null;
    this.value = { ...this.value, to };
    this.externalValue = this.value;
    this.onChange(this.value);
  }
}

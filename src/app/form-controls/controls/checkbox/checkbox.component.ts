import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements ControlValueAccessor  {
@Input() label: string = '';
  @Input() externalValue: boolean | null = null;
  @Input() isReadonly: boolean = false;
  @Input() externalDisabled: boolean = false;

  value: boolean = false;
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
    const errors = this.control?.errors;
    if (!errors) return null;
    if (errors['required']) return 'Este campo es obligatorio';
    for (const key in errors) {
      const err = errors[key];
      if (typeof err === 'object' && 'message' in err) {
        return err.message;
      }
    }
    return 'Campo inválido';
  }

  writeValue(value: any): void {
    this.value = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Angular se encarga del control
  }

  onToggleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.checked;
    this.onChange(this.value);
    this.externalValue = this.value;
  }

}

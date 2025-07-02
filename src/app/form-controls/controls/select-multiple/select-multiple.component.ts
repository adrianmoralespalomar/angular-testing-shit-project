import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { SelectOption } from '../select/select-option-interface';
import { getErrorMessage } from '../shared-functions';

@Component({
  selector: 'app-select-multiple',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, CheckboxComponent],
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.css', '../input.css', '../select/select.component.css'],
})
export class SelectMultipleComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() options: SelectOption[] = [];

  @Input() externalValue: any = null;
  @Input() isReadonly: boolean = false;
  @Input() externalDisabled: boolean = false;
  value: Array<string | number | boolean | null | undefined> | null = null;
  isDropdownOpen = false;

  onChange = (_: any) => {};
  onTouched = () => {};

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

  get showError(): boolean {
    return !!(this.control?.invalid && (this.control.touched || this.control.dirty));
  }

  get errorMessage(): string | null {
    return getErrorMessage(this.control);
  }

  writeValue(value: any): void {
    this.value = value;
    console.log(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(_: boolean): void {}

  toggleDropdown() {
    if (!this.isDisabled && !this.isReadonly) {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  }

  isOptionSelected(optionValue: SelectOption): boolean {
    return this.value?.includes(optionValue.value) ?? false;
  }

  onCheckboxChange(optionValue: any, $event: Event) {
    const checked = ($event.target as HTMLInputElement)?.checked;
    let newValue = Array.isArray(this.value) ? [...this.value] : [];

    if (checked) {
      newValue.push(optionValue);
    } else {
      newValue = newValue.filter((v) => v !== optionValue);
    }

    const finalValue = newValue.length > 0 ? newValue : null;

    this.value = finalValue;
    this.externalValue = finalValue;
    this.onChange(finalValue);
  }

  onSingleSelectChange(optionValue: any) {
    this.value = optionValue;
    this.externalValue = optionValue;
    this.onChange(optionValue);
    this.isDropdownOpen = false;
  }

  getMultiSelectLabel(): string {
    if (!this.value?.length) return '';
    return this.options
      .filter((opt) => this.value?.includes(opt.value))
      .map((opt) => opt.label)
      .join(', ');
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.input-wrapper')) {
      this.isDropdownOpen = false;
    }
  }
}

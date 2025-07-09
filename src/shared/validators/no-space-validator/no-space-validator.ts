import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const isThereWhiteSpace = (control.value || '').trim().length === 0;
    return !isThereWhiteSpace ? null : { iswhitespace: true };
  };
}

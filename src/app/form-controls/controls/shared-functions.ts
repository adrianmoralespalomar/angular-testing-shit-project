import { AbstractControl } from "@angular/forms";

export function getErrorMessage(control:AbstractControl<any,any> | null, maxlength?: number): string | null {
  const errors = control?.errors;
  if (!errors) return null;
  if (errors['required']) return 'Este campo es obligatorio';
  if (errors['maxlength']) return `Longitud máxima debe ser menor o igual a ${getMaxLength(control, maxlength)}`;
  if (errors['max']) return `Valor debe ser menor o igual a ${getMaxvalue(control)}`;
  if (errors['min']) return `Valor debe ser mayor o igual a ${getMinvalue(control)}`;
  //if (errors['invalidEmail']) return errors['invalidEmail'].message ?? 'Email inválido';
  for (const key in errors) { //Devuelve el primer error custom
    const err = errors[key];
    if (typeof err === 'object' && 'message' in err) {
      return err.message;
    }
  }
  return 'Campo inválido';
}

export function getMaxLength(control:AbstractControl<any,any> | null, maxlength?: number):number | undefined{
  //Si le pasamos directamente el maxlength, entonces lo seteamos
  if(maxlength) return maxlength;
  //Sino, leeremos desde el Validators.minLength del FormControl
  const validator = control?.validator;
  if (!validator) return undefined;
  // Creamos un control ficticio con un valor muy alto que siempre va a fallar si hay un max
  const result = validator({ value: 'x'.repeat(9999999) } as any);
  if (result && typeof result === 'object' && 'maxlength' in result) {
    return result['maxlength'].requiredLength;
  }
  return undefined;
}

export function getMaxvalue(control:AbstractControl<any,any> | null): number | undefined{
  const validator = control?.validator;
  if (!validator) return undefined;
  // Creamos un control ficticio con un valor muy alto que siempre va a fallar si hay un max
  const testValue = 999999999;
  const result = validator({ value: testValue } as any);
  if (result && typeof result === 'object' && 'max' in result) {
    return result['max'].max;
  }
  return undefined;
}

export function getMinvalue(control:AbstractControl<any,any> | null): number | undefined{
  const validator = control?.validator;
  if (!validator) return undefined;
  // Creamos un control ficticio con un valor muy alto que siempre va a fallar si hay un max
  const testValue = -999999999;
  const result = validator({ value: testValue } as any);
  if (result && typeof result === 'object' && 'min' in result) {
    return result['min'].min;
  }
  return undefined;
}

export function getMaxDecimals(control:AbstractControl<any,any> | null, maxdecimals?: number): number | undefined{
  //Si le pasamos directamente el maxlength, entonces lo seteamos
  if(maxdecimals) return maxdecimals;
  //Sino, leeremos desde el Validators.minLength del FormControl
  const validator = control?.validator;
  if (!validator) return undefined;
  // Creamos un control ficticio con un valor muy alto que siempre va a fallar si hay un max
  const result = validator({ value: 'x'.repeat(9999999) } as any);
  if (result && typeof result === 'object' && 'maxDecimals' in result) {
    return result['maxDecimals'].requiredDecimals;
  }
  return undefined;
}

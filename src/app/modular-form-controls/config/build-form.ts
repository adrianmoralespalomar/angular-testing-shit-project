import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldRuleSet } from './rule-engine.types';

export function buildForm(fb: FormBuilder, rules: FieldRuleSet): FormGroup {
  //Primero, creamos el formulario vacio
  const form = fb.group({});

  //Recorremos "rules", que son los distintos formControls del formulario.
  Object.entries(rules).forEach(([key, rule]) => {
    const initialValue = rule.initialValue ?? '';
    form.addControl(key, new FormControl({ value: initialValue, disabled: true }));
  });

  applyRules(form, rules);

  // Reaplicar reglas cada vez que cambia cualquier valor
  form.valueChanges.subscribe(() => {
    applyRules(form, rules);
  });

  return form;
}

function applyRules(form: FormGroup, rules: FieldRuleSet): void {
  const values = form.getRawValue(); // Incluye deshabilitados
  Object.entries(rules).forEach(([key, rule]) => {
    const control = form.get(key);
    if (!control) return;

    const shouldShow = rule.showIf ? rule.showIf(values) : true;
    const isRequired = rule.requiredIf ? rule.requiredIf(values) : false;

    if (shouldShow) {
      control.enable({ emitEvent: false });

      const validators = rule.validators || [];
      control.setValidators(isRequired ? [Validators.required, ...validators] : validators);
    } else {
      control.disable({ emitEvent: false });
      control.clearValidators();
    }

    control.updateValueAndValidity({ emitEvent: false });
  });
}

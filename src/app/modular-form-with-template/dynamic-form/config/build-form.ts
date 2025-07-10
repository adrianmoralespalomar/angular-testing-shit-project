import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { FieldRule, FieldRuleSet } from './rule-engine.types';

export function buildForm(fb: FormBuilder, rules: FieldRuleSet, formKeyParent?: string, formGroupDirective?: FormGroupDirective): FormGroup {
  //Primero, creamos el formulario vacio
  //Si existe formKeyParent, quiere decir q es un subformulario, q viene del padre
  const form = !!formKeyParent ? (formGroupDirective?.control?.get(formKeyParent) as FormGroup) : fb.group({});

  //Recorremos "rules", que son los distintos formControls del formulario.
  Object.entries(rules).forEach(([key, rule]) => {
    if (rule.subsection) {
      Object.entries(rule.subsection).forEach(([subkey, subrule]) => {
        addControl(form, subkey, subrule);
      });
    } else addControl(form, key, rule);
  });

  applyRules(form, rules);

  // Reaplicar reglas cada vez que cambia cualquier valor
  form.valueChanges.subscribe(() => {
    applyRules(form, rules);
  });

  return form;
}

function addControl(form: FormGroup, key: string, rule: FieldRule) {
  const initialValue = rule.initialValue ?? undefined;
  form.addControl(key, new FormControl({ value: initialValue, disabled: false }));
}

export function applyRules(form: FormGroup, rules: FieldRuleSet): void {
  Object.entries(rules).forEach(([key, rule]) => {
    if (rule.subsection) {
      Object.entries(rule.subsection).forEach(([subkey, subrule]) => {
        applyRule(form, subkey, subrule);
      });
    } else applyRule(form, key, rule);
  });
}

function applyRule(form: FormGroup, key: string, rule: FieldRule) {
  const values = form.getRawValue(); // Incluye deshabilitados
  const control = form.get(key);
  if (!control) return;

  const shouldShow = rule.showIf ? rule.showIf(values) : true;
  const isRequired = rule.requiredIf ? rule.requiredIf(values) : false;
  const isDisabled = rule.disabledIf ? rule.disabledIf(values) : false;

  if (shouldShow) {
    control.enable({ emitEvent: false });
    const validators = rule.validators || [];
    control.setValidators(isRequired ? [Validators.required, ...validators] : validators);
  } else {
    //Si no aparece, le quitamos el valor
    control.setValue(undefined, { emitEvent: false });
    control.clearValidators();
  }

  if (isDisabled) {
    control.disable({ emitEvent: false });
    control.clearValidators();
  }

  control.updateValueAndValidity({ emitEvent: false });
}

export function patchFormWithApiData(form: FormGroup<any>, openApiData: any, rules: FieldRuleSet) {
  if (openApiData === undefined) return;
  Object.entries(rules).forEach(([key, rule]) => {
    if (rule.subsection) {
      Object.entries(rule.subsection).forEach(([subkey, subrule]) => {
        if (!subrule.openapiProp) return;
        const openapiValue = subrule.openapiProp?.split('.').reduce((acc: any, key) => acc && acc[key], openApiData); //To get nested value
        form.get(subkey)?.patchValue(openapiValue);
      });
    } else {
      if (!rule.openapiProp) return;
      const openapiValue = rule.openapiProp?.split('.').reduce((acc: any, key) => acc && acc[key], openApiData); //To get nested value
      form.get(key)?.patchValue(openapiValue);
    }
  });
}

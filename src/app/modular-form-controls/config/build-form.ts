import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { FieldRuleSet } from './rule-engine.types';

export function buildForm(fb: FormBuilder, rules: FieldRuleSet, formKeyParent?: string, formGroupDirective?: FormGroupDirective): FormGroup {
  //Primero, creamos el formulario vacio
  //Si existe formKeyParent, quiere decir q es un subformulario, q viene del padre
  const form = !!formKeyParent ? (formGroupDirective?.control?.get(formKeyParent) as FormGroup) : fb.group({});

  //Recorremos "rules", que son los distintos formControls del formulario.
  Object.entries(rules).forEach(([key, rule]) => {
    const initialValue = rule.initialValue ?? undefined;
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
    const isDisabled = rule.disabledIf ? rule.disabledIf(values) : false;

    if (shouldShow) {
      control.enable({ emitEvent: false });
      const validators = rule.validators || [];
      control.setValidators(isRequired ? [Validators.required, ...validators] : validators);
    } else {
      control.disable({ emitEvent: false });
      control.clearValidators();
    }

    if (isDisabled) {
      control.disable({ emitEvent: false });
      control.clearValidators();
    }

    control.updateValueAndValidity({ emitEvent: false });
  });
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

//Hace q si enviamos ciudad.provincia.nombre, se nos devuelva un string "ciudad.provincia.nombre" q luego la usaremos en la funcion patchFormWithApiData
export function getPropertyPath<T>(accessor: (obj: T) => any): string {
  const fnStr = accessor.toString();

  // Extrae el acceso después del primer punto (acepta ?. o .)
  const match = fnStr.match(/return\s+[\w\d_]+(?:\?|)\.(.*);?}/) || fnStr.match(/=>\s*[\w\d_]+(?:\?|)\.(.*)/);

  if (!match || !match[1]) return '';

  // Elimina todos los ?. para dejar una ruta limpia
  return match[1].replace(/\?\./g, '.');
}

// export function patchFormWithApiData(form: FormGroup<any>, openApiData: any, rules: FieldRuleSet) {
//   if (openApiData === undefined) return;
//   Object.entries(rules).forEach(([key, rule]) => {
//     if (rule.subsection) {
//       Object.entries(rule.subsection).forEach(([subkey, subrule]) => {
//         if (!subrule.openapiProp) return;
//         const openapi = subrule.openapiProp as keyof typeof openApiData;
//         form.get(subkey)?.patchValue(openApiData?.[openapi]);
//       });
//     } else {
//       if (!rule.openapiProp) return;
//       const openapi = rule.openapiProp as keyof typeof openApiData;
//       form.get(key)?.patchValue(openApiData?.[openapi]);
//     }
//   });
// }

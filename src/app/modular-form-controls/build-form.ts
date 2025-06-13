import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { applyRules } from "./apply-rules";
import { FieldRuleSet } from "./rule-engine.types";

export function buildForm(
  fb: FormBuilder,
  rules: FieldRuleSet
): FormGroup {
  //Primero, creamos el formulario vacio
  const form = fb.group({});

  //Recorremos "rules", que son los distintos formControls del formulario.
   Object.entries(rules).forEach(([key, rule]) => {
    const initialValue = rule.initialValue ?? '';
    form.addControl(
      key,
      new FormControl({ value: initialValue, disabled: true })
    );
  });

  applyRules(form, rules);

  // Reaplicar reglas cada vez que cambia cualquier valor
  form.valueChanges.subscribe(() => {
    applyRules(form, rules);
  });

  return form;
}

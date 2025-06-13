import { FormGroup, Validators } from "@angular/forms";
import { FieldRuleSet } from "./rule-engine.types";

export function applyRules(form: FormGroup, rules: FieldRuleSet): void {
  const values = form.getRawValue(); // Incluye deshabilitados
  console.log('juuu')
  Object.entries(rules).forEach(([key, rule]) => {
    const control = form.get(key);
    if (!control) return;

    const shouldShow = rule.showIf ? rule.showIf(values) : true;
    const isRequired = rule.requiredIf ? rule.requiredIf(values) : false;

    if (shouldShow) {
      control.enable({ emitEvent: false });

      const validators = rule.validators || [];
      control.setValidators(isRequired
        ? [Validators.required, ...validators]
        : validators);
    } else {
      control.disable({ emitEvent: false });
      control.clearValidators();
    }

    control.updateValueAndValidity({ emitEvent: false });
  });
}

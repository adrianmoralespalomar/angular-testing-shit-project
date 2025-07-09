import { Validators } from '@angular/forms';
import { InputNumberComponent } from 'src/app/form-controls/controls/input-number/input-number.component';
import { InputTextComponent } from 'src/app/form-controls/controls/input-text/input-text.component';
import { FieldRuleSet } from '../../dynamic-form/config/rule-engine.types';

export const NAME_REQUIRED_AGE_HIGH: FieldRuleSet = {
  edad: {
    initialValue: 30,
    label: 'Age',
    // si quieres que siempre se muestre, no necesitas condiciones
    validators: [],
    component: InputNumberComponent,
  },
  nombre: {
    openapiProp: 'name', // ← por si mapeas al backend
    label: 'Name',
    showIf: (values) => values['edad'] > 29,
    requiredIf: (values) => values['edad'] > 34,
    validators: [Validators.minLength(2)],
    component: InputTextComponent,
  },

  direccion: {
    validators: [],
  },

  // …tantos campos como necesites
};

import { Validators } from '@angular/forms';
import { FieldRuleSet } from './rule-engine.types';

export const CLIENTE_RULES: FieldRuleSet = {
  edad: {
    initialValue: 30,
    // si quieres que siempre se muestre, no necesitas condiciones
    validators: [],
  },
  nombre: {
    openapiProp: 'name',                 // ← por si mapeas al backend
    showIf: (values) => values['edad'] > 29,
    requiredIf: (values) => values['edad'] > 34,
    validators: [Validators.minLength(2)]
  },

  direccion: {
    validators: []
  },

  // …tantos campos como necesites
};

import { ValidatorFn } from '@angular/forms';

export interface FieldRule {
  /**
   * Nombre del campo en OpenAPI o backend, si quieres mapearlo
   */
  openapiProp?: string;

  /**
   * Condiciones para mostrar el campo. Todas deben cumplirse.
   * Ej:showIf: (values) => values.edad > 29 && values.sexo === 'Hombre'
   */
  showIf?: (formValues: Record<string, any>) => boolean;

  /**
   * Condiciones para que el campo sea requerido. Todas deben cumplirse.
   * Ej: requiredIf: (values) => values.edad > 29 && values.sexo === 'Hombre',
   */
  requiredIf?: (formValues: Record<string, any>) => boolean;

  /**
   * Validadores adicionales del campo
   */
  validators?: ValidatorFn[];

  /** Valor inicial opcional */
  initialValue?: any;
}

export type FieldRuleSet = Record<string, FieldRule>;

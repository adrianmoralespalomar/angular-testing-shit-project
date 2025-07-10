import { Type } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { CheckboxComponent } from 'src/app/form-controls/controls/checkbox/checkbox.component';
import { InputDateComponent } from 'src/app/form-controls/controls/input-date/input-date.component';
import { InputNumberComponent } from 'src/app/form-controls/controls/input-number/input-number.component';
import { InputTextComponent } from 'src/app/form-controls/controls/input-text/input-text.component';
import { RadioButtonComponent, RadioButtonOptions } from 'src/app/form-controls/controls/radio-button/radio-button.component';
import { TextareaComponent } from 'src/app/form-controls/controls/textarea/textarea.component';

export interface FieldRule {
  /**
   * Nombre del campo en OpenAPI o backend, si quieres mapearlo
   */
  openapiProp?: string;

  label?: string;

  /** Si se desea forzar que este campo empiece en una nueva fila */
  startOnNewRow?: boolean;
  /**
   * Cuántas columnas debe ocupar este campo (1 = 1/3 del ancho si hay 3 columnas)
   */
  columnSpan?: 1 | 2 | 3;

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

  disabledIf?: (formValues: Record<string, any>) => boolean;

  /**
   * Validadores adicionales del campo
   */
  validators?: ValidatorFn[];

  /** Valor inicial opcional */
  initialValue?: any;

  /** Componente Angular que renderiza este campo */
  component?: FieldComponentType;
  options?: RadioButtonOptions[];
  orientation?: 'horizontal' | 'vertical';
  subsection?: FieldRuleSet;
}

export type FieldRuleSet = Record<string, FieldRule>;

export type FieldComponentType =
  | Type<CheckboxComponent>
  | Type<InputDateComponent>
  | Type<InputNumberComponent>
  | Type<InputTextComponent> // botón custom
  | Type<RadioButtonComponent>
  | Type<TextareaComponent>;

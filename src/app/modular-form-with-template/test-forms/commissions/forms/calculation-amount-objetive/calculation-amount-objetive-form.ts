import { Validators } from '@angular/forms';
import { InputNumberComponent } from 'src/app/form-controls/controls/input-number/input-number.component';
import { InputTextComponent } from 'src/app/form-controls/controls/input-text/input-text.component';
import { RadioButtonComponent } from 'src/app/form-controls/controls/radio-button/radio-button.component';
import { maxDecimalsValidator } from 'src/app/form-controls/form-controls.component';
import { FieldRuleSet } from 'src/app/modular-form-with-template/dynamic-form/config/rule-engine.types';
import { ObtainingAmountType } from '../../api/models/obtaining-amount-type';
import { ReferenceCaptureDateType } from '../../api/models/reference-capture-date-type';

export const CALC_AMOUNT_OBJETIVES_FORM_KEYS = {
  obtainingAmount: 'obtainingAmount',
  fixedAmount: 'fixedAmount',
  fundField: 'fundField',
  rateApplies: 'rateApplies',
  rateType: 'rateType',
  typeToApply: 'typeToApply',
  referentialCaptureDate: 'referentialCaptureDate',
  referential: 'referential',
  differential: 'differential',
  minReferential: 'minReferential',
  maxReferential: 'maxReferential',
  minFinalRate: 'minFinalRate',
  maxFinalRate: 'maxFinalRate',
  applyFormula: 'applyFormula',
  calculationFinalSettlement: 'calculationFinalSettlement',
};

export const OBTAINING_AMOUNT_FIXED_AMOUNT_VALUE = ObtainingAmountType.ImporteFijo;
export const OBTAINING_AMOUNT_FUND_FIELD_VALUE = ObtainingAmountType.CampoDelFondo;
export const OBTAINING_AMOUNT_OPTIONS = [
  { label: 'Importe fijo', value: OBTAINING_AMOUNT_FIXED_AMOUNT_VALUE },
  { label: 'Campo del fondo', value: OBTAINING_AMOUNT_FUND_FIELD_VALUE },
];

export const REFERENTIAL_CAPTURE_DATE_FIXATION_DATE = ReferenceCaptureDateType.FechaFijacionDeTiposDelFondo;
export const REFERENTIAL_CAPTURE_DATE_PREVIOUS_DETERMINATION = ReferenceCaptureDateType.DeterminacionAnterior;
export const REFERENTIAL_CAPTURE_DATE_PREVIOUS_PAYMENT = ReferenceCaptureDateType.PagoAnterior;
export const REFERENTIAL_CAPTURE_DATE_EARLY_YEAR = ReferenceCaptureDateType.InicioDeAno;
export const REFERENTIAL_CAPTURE_DATE_OPTIONS = [
  { label: 'Fecha fijación de tipos del fondo', value: REFERENTIAL_CAPTURE_DATE_FIXATION_DATE },
  { label: 'Determinación anterior', value: REFERENTIAL_CAPTURE_DATE_PREVIOUS_DETERMINATION },
  { label: 'Pago anterior', value: REFERENTIAL_CAPTURE_DATE_PREVIOUS_PAYMENT },
  { label: 'Inicio de año', value: REFERENTIAL_CAPTURE_DATE_EARLY_YEAR },
];

export const CALC_AMOUNT_OBJETIVES_FORM: FieldRuleSet = {
  [CALC_AMOUNT_OBJETIVES_FORM_KEYS.obtainingAmount]: {
    openapiProp: 'targetAmount.obtainingAmount',
    label: 'Obtencion del importe',
    validators: [Validators.required],
    component: RadioButtonComponent,
    options: OBTAINING_AMOUNT_OPTIONS,
  },
  [CALC_AMOUNT_OBJETIVES_FORM_KEYS.fixedAmount]: {
    openapiProp: 'targetAmount.fixedAmount',
    label: 'Importe',
    validators: [Validators.required, maxDecimalsValidator(2)],
    showIf: (values) => values[CALC_AMOUNT_OBJETIVES_FORM_KEYS.obtainingAmount] === OBTAINING_AMOUNT_FIXED_AMOUNT_VALUE,
    component: InputNumberComponent,
    startOnNewRow: true,
  },
  [CALC_AMOUNT_OBJETIVES_FORM_KEYS.fundField]: {
    openapiProp: 'targetAmount.fundFieldValue',
    label: 'Campo del fondo',
    validators: [Validators.required],
    showIf: (values) => values[CALC_AMOUNT_OBJETIVES_FORM_KEYS.obtainingAmount] === OBTAINING_AMOUNT_FUND_FIELD_VALUE,
    component: InputTextComponent,
    startOnNewRow: true,
  },
  [CALC_AMOUNT_OBJETIVES_FORM_KEYS.rateApplies]: {
    openapiProp: 'targetAmount.fundFieldValue',
    label: 'Sobre el importe anterior Se aplica tasa?',
    validators: [Validators.required],
    showIf: (values) => values[CALC_AMOUNT_OBJETIVES_FORM_KEYS.obtainingAmount] === OBTAINING_AMOUNT_FUND_FIELD_VALUE,
    component: RadioButtonComponent,
    options: [
      { label: 'Si', value: true },
      { label: 'No', value: false },
    ],
    startOnNewRow: true,
  },
  [CALC_AMOUNT_OBJETIVES_FORM_KEYS.rateType]: {
    openapiProp: 'targetAmount.rateType',
    label: 'Tipo Tasa',
    validators: [Validators.required],
    showIf: (values) => values[CALC_AMOUNT_OBJETIVES_FORM_KEYS.rateApplies] === true,
    component: RadioButtonComponent,
    options: [
      { label: 'Fijo', value: 'Fijo' },
      { label: 'Variable', value: 'Variable' },
    ],
    startOnNewRow: true,
  },
};

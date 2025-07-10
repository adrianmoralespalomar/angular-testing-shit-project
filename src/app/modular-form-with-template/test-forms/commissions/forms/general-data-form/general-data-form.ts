import { Validators } from '@angular/forms';
import { InputTextComponent } from 'src/app/form-controls/controls/input-text/input-text.component';
import { RadioButtonComponent } from 'src/app/form-controls/controls/radio-button/radio-button.component';
import { noSpaceValidator } from 'src/shared/validators/no-space-validator/no-space-validator';
import { FieldRuleSet } from '../../../../dynamic-form/config/rule-engine.types';

export const GENERAL_DATA_FORM_KEYS = {
  name: 'name',
  spanishName: 'spanishName',
  englishName: 'englishName',
  isManagementCommission: 'isManagementCommission',
  accrues: 'accrues',
  ordenDeLaCascadaFaltaBackWaterfall: 'ordenDeLaCascadaFaltaBackWaterfall',
  cascadaAoBFaltaBackWaterfall: 'cascadaAoBFaltaBackWaterfall',
  pagaBancoSNFaltaBackWaterfall: 'pagaBancoSNFaltaBackWaterfall',
};

export const GENERAL_DATA_FORM: FieldRuleSet = {
  [GENERAL_DATA_FORM_KEYS.name]: {
    openapiProp: 'name',
    label: 'Name',
    validators: [Validators.required, noSpaceValidator()],
    component: InputTextComponent,
  },
  [GENERAL_DATA_FORM_KEYS.spanishName]: {
    openapiProp: 'description_es',
    label: 'Descripcion Nombre Español',
    component: InputTextComponent,
  },
  [GENERAL_DATA_FORM_KEYS.englishName]: {
    openapiProp: 'description_en',
    label: 'Descripcion Nombre Ingles',
    component: InputTextComponent,
  },
  [GENERAL_DATA_FORM_KEYS.isManagementCommission]: {
    openapiProp: 'isManagement',
    label: 'Comisión de Gestión',
    validators: [Validators.required],
    component: RadioButtonComponent,
    options: [
      { label: 'Si', value: true },
      { label: 'No', value: false },
    ],
  },
  [GENERAL_DATA_FORM_KEYS.accrues]: {
    openapiProp: 'accrues',
    label: 'Comisión devenga',
    validators: [Validators.required],
    component: RadioButtonComponent,
    options: [
      { label: 'Si', value: true },
      { label: 'No', value: false },
    ],
  },
  cascadeInfo: {
    label: 'Informacion De La Cascada para Amortizacion',
    subsection: {
      [GENERAL_DATA_FORM_KEYS.ordenDeLaCascadaFaltaBackWaterfall]: {
        openapiProp: 'modifiedOrder',
        label: 'Orden de la cascada',
        startOnNewRow: true,
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
      [GENERAL_DATA_FORM_KEYS.cascadaAoBFaltaBackWaterfall]: {
        openapiProp: 'cascadeIndex',
        label: 'Cascada A o B',
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
      [GENERAL_DATA_FORM_KEYS.pagaBancoSNFaltaBackWaterfall]: {
        openapiProp: 'bankPays',
        label: 'Paga Banco (S/N)',
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
    },
  },
};

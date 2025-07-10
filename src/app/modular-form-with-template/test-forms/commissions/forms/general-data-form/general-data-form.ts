import { Validators } from '@angular/forms';
import { InputTextComponent } from 'src/app/form-controls/controls/input-text/input-text.component';
import { RadioButtonComponent } from 'src/app/form-controls/controls/radio-button/radio-button.component';
import { getPropertyPath } from 'src/app/modular-form-with-template/dynamic-form/config/build-form';
import { noSpaceValidator } from 'src/shared/validators/no-space-validator/no-space-validator';
import { FieldRuleSet } from '../../../../dynamic-form/config/rule-engine.types';
import { Commission } from '../../api/models/commission';

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
    //openapiProp: 'name',
    openapiProp: getPropertyPath<Commission>((x) => x.name), //Esto es util si queremos tiparlo
    label: 'Name',
    validators: [Validators.required, noSpaceValidator()],
    component: InputTextComponent,
  },
  [GENERAL_DATA_FORM_KEYS.spanishName]: {
    //openapiProp: 'description_es',
    openapiProp: getPropertyPath<Commission>((x) => x.description_es), //Esto es util si queremos tiparlo
    label: 'Descripcion Nombre Español',
    component: InputTextComponent,
  },
  [GENERAL_DATA_FORM_KEYS.englishName]: {
    //openapiProp: 'description_en',
    openapiProp: getPropertyPath<Commission>((x) => x.description_en), //Esto es util si queremos tiparlo
    label: 'Descripcion Nombre Ingles',
    component: InputTextComponent,
  },
  [GENERAL_DATA_FORM_KEYS.isManagementCommission]: {
    //openapiProp: 'isManagement',
    openapiProp: getPropertyPath<Commission>((x) => x.isManagement), //Esto es util si queremos tiparlo
    label: 'Comisión de Gestión',
    validators: [Validators.required],
    component: RadioButtonComponent,
    options: [
      { label: 'Si', value: true },
      { label: 'No', value: false },
    ],
  },
  [GENERAL_DATA_FORM_KEYS.accrues]: {
    //openapiProp: 'accrues',
    openapiProp: getPropertyPath<Commission>((x) => x.accrues), //Esto es util si queremos tiparlo
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
        //openapiProp: 'modifiedOrder',
        openapiProp: getPropertyPath<Commission>((x) => x.modifiedOrder), //Esto es util si queremos tiparlo
        label: 'Orden de la cascada',
        startOnNewRow: true,
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
      [GENERAL_DATA_FORM_KEYS.cascadaAoBFaltaBackWaterfall]: {
        //openapiProp: 'cascadeIndex',
        openapiProp: getPropertyPath<Commission>((x) => x.cascadeIndex), //Esto es util si queremos tiparlo
        label: 'Cascada A o B',
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
      [GENERAL_DATA_FORM_KEYS.pagaBancoSNFaltaBackWaterfall]: {
        //openapiProp: 'bankPays',
        openapiProp: getPropertyPath<Commission>((x) => x.bankPays), //Esto es util si queremos tiparlo
        label: 'Paga Banco (S/N)',
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
    },
  },
};

import { Validators } from '@angular/forms';
import { InputTextComponent } from 'src/app/form-controls/controls/input-text/input-text.component';
import { RadioButtonComponent } from 'src/app/form-controls/controls/radio-button/radio-button.component';
import { noSpaceValidator } from 'src/shared/validators/no-space-validator/no-space-validator';
import { FieldRuleSet } from '../../../../dynamic-form/config/rule-engine.types';

export const GENERAL_DATA_FORM: FieldRuleSet = {
  nombre: {
    openapiProp: 'name',
    label: 'Name',
    validators: [Validators.required, noSpaceValidator()],
    component: InputTextComponent,
  },
  spanishName: {
    openapiProp: 'description_es',
    label: 'Descripcion Nombre Español',
    component: InputTextComponent,
  },
  englishName: {
    openapiProp: 'description_en',
    label: 'Descripcion Nombre Ingles',
    component: InputTextComponent,
  },
  isManagementCommission: {
    openapiProp: 'isManagement',
    label: 'Comisión de Gestión',
    validators: [Validators.required],
    component: RadioButtonComponent,
    options: [
      { label: 'Si', value: true },
      { label: 'No', value: false },
    ],
  },
  accrues: {
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
    subsection: {
      ordenDeLaCascadaFaltaBackWaterfall: {
        openapiProp: 'modifiedOrder',
        label: 'Orden de la cascada',
        startOnNewRow: true,
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
      cascadaAoBFaltaBackWaterfall: {
        openapiProp: 'cascadeIndex',
        label: 'Cascada A o B',
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
      pagaBancoSNFaltaBackWaterfall: {
        openapiProp: 'bankPays',
        label: 'Paga Banco (S/N)',
        component: InputTextComponent,
        disabledIf: (values) => true,
      },
    },
  },
  // cascadeInfo: {
  //   label: 'CASCADA INFO',
  //   subsectionwidth: 3,
  // },
  // ordenDeLaCascadaFaltaBackWaterfall: {
  //   openapiProp: 'modifiedOrder',
  //   label: 'Orden de la cascada',
  //   startOnNewRow: true,
  //   component: InputTextComponent,
  //   disabledIf: (values) => true,
  // },
  // cascadaAoBFaltaBackWaterfall: {
  //   openapiProp: 'cascadeIndex',
  //   label: 'Cascada A o B',
  //   component: InputTextComponent,
  //   disabledIf: (values) => true,
  // },
  // pagaBancoSNFaltaBackWaterfall: {
  //   openapiProp: 'bankPays',
  //   label: 'Paga Banco (S/N)',
  //   component: InputTextComponent,
  //   disabledIf: (values) => true,
  // },
};

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CheckboxComponent } from './controls/checkbox/checkbox.component';
import { DualListTransferComponent, TransferItem } from './controls/dual-list-transfer/dual-list-transfer.component';
import { InputDateComponent } from './controls/input-date/input-date.component';
import { InputNumberComponent } from './controls/input-number/input-number.component';
import { InputTextComponent } from './controls/input-text/input-text.component';
import { RadioButtonComponent, RadioButtonOptions } from './controls/radio-button/radio-button.component';
import { SelectMultipleComponent } from './controls/select-multiple/select-multiple.component';
import { SelectOption } from './controls/select/select-option-interface';
import { SelectComponent } from './controls/select/select.component';
import { TextareaComponent } from './controls/textarea/textarea.component';

@Component({
  selector: 'app-form-controls',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatExpansionModule, CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, InputTextComponent, InputNumberComponent, MatExpansionModule, RadioButtonComponent, CheckboxComponent, InputDateComponent, TextareaComponent, SelectComponent, SelectMultipleComponent, DualListTransferComponent],
  standalone: true,
  templateUrl: './form-controls.component.html',
  styleUrls: ['./form-controls.component.css'],
})
export class FormControlsComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  protected formText: FormGroup | undefined = undefined;
  protected formNumber: FormGroup | undefined = undefined;
  protected formSelect: FormGroup | undefined = undefined;
  protected formSelectMultiple: FormGroup | undefined = undefined;
  protected cities: SelectOption[] = [
    { label: 'Madrid', value: 1 },
    { label: 'Barcelona', value: 2 },
    { label: 'Sevilla', value: 3 },
    { label: 'True', value: true },
    { label: 'False', value: false },
    { label: 'False as string', value: 'false' },
  ];
  protected formRaddioButton: FormGroup | undefined = undefined;
  protected genres: RadioButtonOptions[] = [
    { label: 'Man', value: 1 },
    { label: 'Woman', value: 2 },
  ];
  protected formCheckBox: FormGroup | undefined = undefined;
  protected formDate: FormGroup | undefined = undefined;
  protected formTextarea: FormGroup | undefined = undefined;
  protected dualListTransferAvailable: TransferItem[] = [
    { id: 1, description: 'Descripción larga 1' },
    { id: 2, description: 'Descripción larga 2' },
    { id: 3, description: 'Descripción larga 3' },
    { id: 4, description: 'Descripción larga 4' },
    { id: 5, description: 'Descripción larga 5' },
    { id: 6, description: 'Descripción larga 6' },
    { id: 7, description: 'Descripción larga 7' },
    { id: 8, description: 'Descripción larga 8' },
    { id: 9, description: 'Descripción larga 9' },
    { id: 10, description: 'Descripción larga 10' },
    { id: 11, description: 'Descripción larga 11' },
    { id: 12, description: 'Descripción larga 12' },
    { id: 13, description: 'Descripción larga 13' },
    { id: 14, description: 'Descripción larga 14' },
  ];
  protected dualListTransferSelected: TransferItem[] = [];

  ngOnInit() {
    this.setInitialFormText();
    this.setInitialFormNumber();
    this.setInitialFormSelect();
    this.setInitialFormSelectMultiple();
    this.setInitialFormRaddioButton();
    this.setInitialFormCheckBox();
    this.setInitialFormDate();
    this.setInitialFormTextarea();
  }

  setInitialFormText() {
    this.formText = this._formBuilder.group({
      name: this._formBuilder.control('', [Validators.required, Validators.maxLength(10)]),
      nameTwo: this._formBuilder.control('', [Validators.required]),
      nameAllowInvalid: this._formBuilder.control('', [Validators.required, Validators.maxLength(10)]),
      nameDisabled: [{ value: 'Nombre Disabled', disabled: true }, [Validators.required, Validators.maxLength(10)]],
      nameReadonly: [{ value: 'Nombre Readonly', disabled: true }, [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, customEmailValidator]],
    });
  }

  setInitialFormNumber() {
    this.formNumber = this._formBuilder.group<FormNumber>({
      number: this._formBuilder.control(3),
      numberMax: this._formBuilder.nonNullable.control(2, [Validators.required, Validators.max(120)]),
      numberMin: this._formBuilder.nonNullable.control(1, [Validators.required, Validators.min(10)]),
      numberWith2Decimals: this._formBuilder.nonNullable.control(12.23, [Validators.required, Validators.min(10)]),
      numberWith2DecimalsNoInput: this._formBuilder.nonNullable.control(12.23, [Validators.required, Validators.min(10), maxDecimalsValidator(2)]),
      numberDisabled: this._formBuilder.control({ value: 39, disabled: true }),
      numberReadonly: this._formBuilder.control({ value: 69, disabled: true }),
      percentage: this._formBuilder.control(3, maxDecimalsValidator(2)),
    });
  }

  setInitialFormSelect() {
    this.formSelect = this._formBuilder.group({
      city: this._formBuilder.control(null),
      citySelected: this._formBuilder.control(this.cities[2].value, [Validators.required]),
      cityDisabled: this._formBuilder.control({ value: this.cities[1].value, disabled: true }, [Validators.required]),
    });
  }

  setInitialFormSelectMultiple() {
    this.formSelectMultiple = this._formBuilder.group({
      city: this._formBuilder.control(null),
      citySelected: this._formBuilder.control([this.cities[0].value, this.cities[2].value], [Validators.required]),
      cityDisabled: this._formBuilder.control({ value: [this.cities[3].value, this.cities[4].value], disabled: true }, [Validators.required]),
    });
  }

  setInitialFormRaddioButton() {
    this.formRaddioButton = this._formBuilder.group({
      genre: this._formBuilder.control(null),
      genreRequired: this._formBuilder.control(null, [Validators.required]),
      genreDisabled: [{ value: 1, disabled: true }, [Validators.required]],
    });
  }

  setInitialFormCheckBox() {
    this.formCheckBox = this._formBuilder.group({
      isSpanish: this._formBuilder.control(null),
      isSpanishRequired: this._formBuilder.control(null, [Validators.required]),
      isSpanishDisabled: [{ value: true, disabled: true }, [Validators.required]],
    });
  }

  setInitialFormDate() {
    this.formDate = this._formBuilder.group({
      bd: this._formBuilder.control(null),
      bdRequired: this._formBuilder.control(null, [Validators.required]),
      bdDisabled: [{ value: null, disabled: true }, [Validators.required]],
      bdRange: this._formBuilder.control(null),
    });
  }

  setInitialFormTextarea() {
    this.formTextarea = this._formBuilder.group({
      random: this._formBuilder.control(null),
      randomRequired: this._formBuilder.control(null, [Validators.required]),
      randomDisabled: [{ value: null, disabled: true }, [Validators.required]],
    });
  }

  updateDualListTransfer(e: { availableItems: TransferItem[]; selectedItems: TransferItem[] }) {
    this.dualListTransferAvailable = e.availableItems;
    this.dualListTransferSelected = e.selectedItems;
  }
}

function customEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) {
    return { invalidEmail: { message: 'El formato del email debe ser ejemplo@dominio.com' } };
  }
  return null;
}

export function maxDecimalsValidator(maxDecimals: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value == null || value === '') return null;
    if (isNaN(value)) return { maxDecimals: { requiredDecimals: maxDecimals, actual: value } };

    const strValue = value.toString();
    const decimalPart = strValue.split('.')[1];

    if (decimalPart && decimalPart.length > maxDecimals) {
      return {
        maxDecimals: {
          requiredDecimals: maxDecimals,
          actualDecimals: decimalPart.length,
          message: `Máximo ${maxDecimals} decimales permitidos`,
        },
      };
    }

    return null;
  };
}

interface FormNumber {
  number: FormControl<number | null>;
  numberMax: FormControl<number>;
  numberMin: FormControl<number>;
  numberWith2Decimals: FormControl<number>;
  numberWith2DecimalsNoInput: FormControl<number>;
  numberDisabled: FormControl<number | null>;
  numberReadonly: FormControl<number | null>;
  percentage: FormControl<number | null>;
}

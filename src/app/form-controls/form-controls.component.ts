import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { InputNumberComponent } from './controls/input-number/input-number.component';
import { InputTextComponent } from './controls/input-text/input-text.component';

@Component({
  selector: 'app-form-controls',
  imports: [ MatTableModule, MatIconModule, MatButtonModule, MatExpansionModule, CommonModule, ReactiveFormsModule,FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,InputTextComponent,InputNumberComponent, MatExpansionModule],
  standalone:true,
  templateUrl: './form-controls.component.html',
  styleUrls: ['./form-controls.component.css']
})
export class FormControlsComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  protected formText : FormGroup | undefined = undefined;
  protected formNumber : FormGroup | undefined = undefined;

  ngOnInit() {
    this.setInitialFormText();
    this.setInitialFormNumber();
  }

  setInitialFormText(){
    this.formText = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(10)]],
      nameDisabled: [{value:'Nombre Disabled', disabled:true}, [Validators.required, Validators.maxLength(10)]],
      nameReadonly: [{value:'Nombre Readonly', disabled:true}, [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, customEmailValidator]],
    });
  }

  setInitialFormNumber(){
    this.formNumber = this._formBuilder.group<FormNumber>({
      number: this._formBuilder.control(3),
      numberMax: this._formBuilder.nonNullable.control(2, [Validators.required, Validators.max(120)]),
      numberMin: this._formBuilder.nonNullable.control(1, [Validators.required, Validators.min(10)]),
      numberWith2Decimals: this._formBuilder.nonNullable.control(12.23, [Validators.required, Validators.min(10)]),
      numberDisabled: this._formBuilder.control({value:39, disabled:true}),
      numberReadonly: this._formBuilder.control({value:69, disabled:true}),
    });
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

interface FormNumber{
  number:FormControl<number | null>;
  numberMax:FormControl<number>;
  numberMin:FormControl<number>;
  numberWith2Decimals:FormControl<number>;
  numberDisabled:FormControl<number | null>;
  numberReadonly:FormControl<number | null>;
}

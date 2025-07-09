import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from 'src/app/form-controls/controls/checkbox/checkbox.component';
import { InputDateComponent } from 'src/app/form-controls/controls/input-date/input-date.component';
import { InputNumberComponent } from 'src/app/form-controls/controls/input-number/input-number.component';
import { InputTextComponent } from 'src/app/form-controls/controls/input-text/input-text.component';
import { RadioButtonComponent } from 'src/app/form-controls/controls/radio-button/radio-button.component';
import { TextareaComponent } from 'src/app/form-controls/controls/textarea/textarea.component';
import { FieldRuleSet } from './config/rule-engine.types';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, CheckboxComponent, InputDateComponent, InputNumberComponent, InputTextComponent, RadioButtonComponent, TextareaComponent],
})
export class DynamicFormComponent implements OnInit {
  @Input() title = '';
  @Input() form!: FormGroup;
  @Input() rules!: FieldRuleSet;
  visibleFields: any[] = [];
  InputNumberComponent = InputNumberComponent;
  InputTextComponent = InputTextComponent;
  RadioButtonComponent = RadioButtonComponent;

  ngOnInit() {
    this.updateVisibleFields();
    this.form.valueChanges.subscribe(() => this.updateVisibleFields());
  }

  updateVisibleFields() {
    const values = this.form.getRawValue(); // Para evaluar showIf si existe
    this.visibleFields = Object.keys(this.rules).filter((field) => {
      const rule = this.rules[field];
      const control = this.form.get(field);
      const shouldShow = rule.showIf ? rule.showIf(values) : true;
      if (field === 'cascadeInfo') {
        console.log(rule);
        console.log(control);
        console.log(shouldShow);
      }
      return shouldShow;
    });

    console.log(this.visibleFields);
  }

  updateVisibleSubFields(subsectionKey: string, width: number) {
    const index = Object.keys(this.rules).indexOf(subsectionKey);
    const array = Object.keys({ ...this.rules }) as Array<string>;
    const subsection = array.slice(index, index + width);
    return subsection;
  }
}

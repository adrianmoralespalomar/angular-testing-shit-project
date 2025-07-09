import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommissionsComponent } from './test-forms/commissions/commissions.component';
import { NameRequiredAgeHighComponent } from './test-forms/name-required-age-high/name-required-age-high.component';

@Component({
  standalone: true,
  selector: 'app-modular-form-with-template',
  imports: [NameRequiredAgeHighComponent, CommissionsComponent, MatExpansionModule],
  template: `
    <mat-accordion multi>
      <mat-expansion-panel id="Name Required Age High">
        <mat-expansion-panel-header><mat-panel-title> Name Required Age High </mat-panel-title></mat-expansion-panel-header>
        <app-name-required-age-high />
      </mat-expansion-panel>

      <mat-expansion-panel id="Name Required Age High">
        <mat-expansion-panel-header><mat-panel-title>Commissions</mat-panel-title></mat-expansion-panel-header>
        <app-commissions />
      </mat-expansion-panel>
    </mat-accordion>
  `,
})
export class ModularFormWithTemplateComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <button mat-raised-button color="primary" [routerLink]="'list-with-expanded-rows'">List with expanded rows</button>
      <button mat-raised-button color="accent" [routerLink]="'form-controls'">Form Controls</button>
      <button mat-raised-button color="accent" [routerLink]="'modular-form-controls'">Modular Form Controls</button>
      <button mat-raised-button color="accent" [routerLink]="'modular-form-with-template'">Modular Form With Template</button>
      <button mat-raised-button color="warn" [routerLink]="'table'">Table</button>
    </div>
    <router-outlet />
  `,
})
export class AppComponent {
  title = 'angular-testing-shit-project';
}

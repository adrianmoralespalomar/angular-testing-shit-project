import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
    <button mat-raised-button color="primary" [routerLink]="'list-with-expanded-rows'">List with expanded rows</button>
    <button mat-raised-button color="accent" [routerLink]="'form-controls'">Form Controls</button>
    <button mat-raised-button color="accent" [routerLink]="'modular-form-controls'">Modular Form Controls</button>
  `,
})
export class AppComponent {
  title = 'angular-testing-shit-project';
  pepito() {}
}

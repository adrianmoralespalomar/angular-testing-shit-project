import { Routes } from "@angular/router";

export const ROUTES:Routes = [
  {
    path:'list-with-expanded-rows',
    loadComponent : ()=> import ('./list-with-expandedrows/list-with-expandedrows.component').then((x)=>x.ListWithExpandedrowsComponent)
  },
  {
    path:'form-controls',
    loadComponent : ()=> import ('./form-controls/form-controls.component').then((x)=>x.FormControlsComponent)
  }
]

export default ROUTES;

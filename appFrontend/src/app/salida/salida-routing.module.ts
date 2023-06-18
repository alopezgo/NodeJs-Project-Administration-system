import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalidaPage } from './salida.page';

const routes: Routes = [
  {
    path: '',
    component: SalidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalidaPageRoutingModule {}

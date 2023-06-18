import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarpassPage } from './recuperarpass.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarpassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarpassPageRoutingModule {}

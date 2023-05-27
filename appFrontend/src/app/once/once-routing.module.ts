import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OncePage } from './once.page';

const routes: Routes = [
  {
    path: '',
    component: OncePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OncePageRoutingModule {}

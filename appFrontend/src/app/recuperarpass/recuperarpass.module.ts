import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarpassPageRoutingModule } from './recuperarpass-routing.module';

import { RecuperarpassPage } from './recuperarpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarpassPageRoutingModule
  ],
  declarations: [RecuperarpassPage]
})
export class RecuperarpassPageModule {}

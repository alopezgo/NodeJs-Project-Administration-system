import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalidaPageRoutingModule } from './salida-routing.module';

import { SalidaPage } from './salida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalidaPageRoutingModule
  ],
  declarations: [SalidaPage]
})
export class SalidaPageModule {}

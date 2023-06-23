import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';




import { IonicModule } from '@ionic/angular';

import { DesayunoPageRoutingModule } from './desayuno-routing.module';

import { DesayunoPage } from './desayuno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesayunoPageRoutingModule
  ],
  declarations: [DesayunoPage],
  providers: [DatePipe]
})
export class DesayunoPageModule {}

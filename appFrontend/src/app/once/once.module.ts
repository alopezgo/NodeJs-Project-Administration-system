import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OncePageRoutingModule } from './once-routing.module';

import { OncePage } from './once.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OncePageRoutingModule
  ],
  declarations: [OncePage]
})
export class OncePageModule {}

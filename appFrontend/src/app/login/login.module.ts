import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../auth-service.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage],
  providers: [AuthService] // Agrega el servicio a la lista de proveedores

})
export class LoginPageModule {}

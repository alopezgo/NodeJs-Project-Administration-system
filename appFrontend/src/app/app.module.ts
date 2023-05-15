import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { RegistroPage } from './registro/registro.page';






@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule ,IonicModule.forRoot(), AppRoutingModule, FormsModule, IonicModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent, RegistroPage],
})
export class AppModule {}

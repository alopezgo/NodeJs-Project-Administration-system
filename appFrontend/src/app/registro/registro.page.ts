import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule, NavController } from '@ionic/angular'; // Importa IonicModule
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  nombre:string = '';
  apellido: string = '';
  correo: string = '';

  consumo: number = 0;

  constructor(private http: HttpClient, private navCtrl: NavController, private router:Router) {
   
  }

  addConsumo(id_tipo_consumo:number){
    this.consumo = id_tipo_consumo;

    let extras: NavigationExtras = {
      state: {
        pass: this.consumo,
      }
    }
    if (this.consumo == 1){
      this.router.navigate(['desayuno'], extras);
    }     
    if (this.consumo == 2){
      this.router.navigate(['almuerzo'], extras);
    }
    if (this.consumo == 3){
      this.router.navigate(['once'], extras);
    }
    if (this.consumo == 4){
      this.router.navigate(['cena'], extras);
    }
    
    
  }



  goBack() {
    
    window.history.back();
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['login'])
  }
  
}

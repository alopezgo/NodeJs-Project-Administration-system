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

  // addConsumo(id_tipo_consumo: number) {
  //   const consumo = {
  //     id_tipo_consumo: id_tipo_consumo,
  //     precio: 0
  //   };
  //   const data = {
  //     rut_empleado: this.rut_empleado,
  //     consumo: consumo,
  //   };
  //   this.http.post('http://localhost:3000/api/v1/consumos/registrarConsumo', data)
  //     .subscribe(
  //       (response: any) => {
  //         console.log(response);
  //         alert("Se ha registrado el consumo correctamente");
  //       },
  //       (error) => {
  //         console.error(error);
  //         alert("NO SE PUDO registrar el consumo correctamente");
  //       }
  //     );
  // }

  goBack(): void {
    this.navCtrl.back();
  }
}

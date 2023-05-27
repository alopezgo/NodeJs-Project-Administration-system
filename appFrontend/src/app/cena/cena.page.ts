import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular'; // Importa IonicModule

@Component({
  selector: 'app-cena',
  templateUrl: './cena.page.html',
  styleUrls: ['./cena.page.scss'],
})
export class CenaPage implements OnInit {

  rut_empleado: string;
  consumo: number = 0;

  constructor(private http: HttpClient, private navCtrl: NavController,private router:Router) { }
  ngOnInit() {

    try {
      this.consumo = this.router.getCurrentNavigation().extras.state.pass;
      
    } catch (error) {
      this.router.navigate(['registro'])       
      
     
    }
  }
  
  addConsumo(consumoForm: NgForm) {

    const rut  = consumoForm.value.rut;

    console.log(rut)
    console.log(this.consumo)

    const consumo = {
       id_tipo_consumo: this.consumo
     };

    const data = {
      rut_empleado: rut.trim(),
      consumo: consumo,
    };
    console.log(data)
    this.http.post('http://localhost:3000/api/v1/consumos/registrarConsumo', data)
      .subscribe(
        (response: any) => {
          console.log(response);
          alert("Se ha registrado el consumo correctamente");
        },
        (error) => {
          console.error(error);
          alert("NO SE PUDO registrar el consumo correctamente");
        }
      );
  }

  goBack(): void {
    this.navCtrl.back();
  }
}
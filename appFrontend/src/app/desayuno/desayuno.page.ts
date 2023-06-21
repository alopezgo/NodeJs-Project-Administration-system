import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

const { BarcodeScanner } = Plugins;

@Component({
  selector: 'app-desayuno',
  templateUrl: './desayuno.page.html',
  styleUrls: ['./desayuno.page.scss'],
})
export class DesayunoPage implements OnInit {

  rut_empleado: string = '';
  consumo: number = 0;

  hiddenPage: boolean = false; // Variable para controlar la visibilidad de la página


  constructor(private http: HttpClient, private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
    try {
      const navigationState = this.router.getCurrentNavigation();
      if (navigationState && navigationState.extras && navigationState.extras.state && navigationState.extras.state['pass']) {
        this.consumo = navigationState.extras.state['pass'];
      } else {
        throw new Error('El objeto es nulo');
      }
    } catch (error) {
      console.error(error);
      this.router.navigate(['registro']);
    }
  }

  async leerQR() {

    let that = this;

   this.router.navigate(['qr'])

   const bodyElement = document.querySelector('body');
    if (bodyElement) {
    bodyElement.classList.add('scanner-active');
    bodyElement.style.display = 'none';
  }


   await BarcodeScanner["checkPermission"]({ force: true });

      BarcodeScanner["hideBackground"]();

      this.hiddenPage = false; // Mostrar la página nuevamente después de cerrar la cámara

      const result = await BarcodeScanner["startScan"]();
      if (result.hasContent) {
        let contenido = result.content;
        that.rut_empleado = contenido.trim();
        console.log('Contenido del código QR:', contenido);
      }

      const bodyElement2 = document.querySelector('body');
      if (bodyElement2) {
        bodyElement2.classList.add('scanner-active');
        bodyElement2.style.display = 'block';
      }
      
     this.router.navigate(['registro'])


  }


  async addConsumo(consumoForm: NgForm) {

    let that = this;

    await this.leerQR(); //llamamos la función del QR

    


        const consumo = {
          id_tipo_consumo: that.consumo
        };

        const data = {
          rut_empleado: that.rut_empleado.trim(),
          consumo: consumo,
        };

        this.http.post('http://192.168.1.120:3000/api/v1/consumos/registrarConsumo', data)
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

      logOut(): void {
        localStorage.clear();
        this.router.navigate(['login'])
      }
	  
    
    
    
  }


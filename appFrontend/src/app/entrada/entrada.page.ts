import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, NavController } from '@ionic/angular'; // Importa IonicModule

import { Plugins } from '@capacitor/core';

const { BarcodeScanner } = Plugins;
@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  rut_empleado: string = '';
  asistencia: number = 0;

  hiddenPage: boolean = false; // Variable para controlar la visibilidad de la página


  constructor(private http: HttpClient, private navCtrl: NavController,private router:Router, private alertController: AlertController) { }

  ngOnInit() {
    try {
      const navigationState = this.router.getCurrentNavigation();
      if (navigationState && navigationState.extras && navigationState.extras.state && navigationState.extras.state['pass']) {
        this.asistencia = navigationState.extras.state['pass'];
      } else {
        throw new Error('El objeto es nulo');
      }
    } catch (error) {
      console.error(error);
      this.router.navigate(['asistencia']);
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


  async addAsistencia(consumoForm: NgForm) {

    let that = this;

    await this.leerQR(); //llamamos la función del QR    




        const data = {
          rut_empleado: that.rut_empleado.trim(),
          id_tipo_asistencia: that.asistencia,
        };

        this.http.post('http://192.168.1.120:3000/api/v1/addAsistencia', data)
          .subscribe(
            (response: any) => {
              console.log(response);
              this.showAlert('Exito', 'Se ha registrado la asistencia correctamente');
            },
            (error) => {
              console.error(error);
              this.showAlert('Error', 'No ha registrado la asistencia correctamente');
            }
          );

         
      }

      goBack(): void {
       
        this.router.navigate(['registro'])

    }

      logOut(): void {
        localStorage.clear();
        this.router.navigate(['home'])
      }

      
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }
	  
    
    
    
  }


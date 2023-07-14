import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, NavController } from '@ionic/angular'; // Importa IonicModule
import { Plugins } from '@capacitor/core';

const { BarcodeScanner } = Plugins;

@Component({
  selector: 'app-almuerzo',
  templateUrl: './almuerzo.page.html',
  styleUrls: ['./almuerzo.page.scss'],
})
export class AlmuerzoPage implements OnInit {

  rut_empleado: string = '';
  consumo: number = 0;

  hiddenPage: boolean = false; // Variable para controlar la visibilidad de la página


  constructor(private http: HttpClient, private navCtrl: NavController,private router:Router, private alertController: AlertController) { }

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


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
  
    await alert.present();
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
              this.showAlert('Éxito', 'Se ha registrado el consumo correctamente');

            },
            (error) => {
              console.error(error);
              this.showAlert('Error', 'Ya existe un consumo el día de hoy' );
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
    
    
  }


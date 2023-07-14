import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

const userAgent = navigator.userAgent;




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loggingIn = false;
  nombre: string = '';
  apellido: string = '';
  rol: string = '';
  correo: string = '';
  id: any = '';




  constructor(
    private http: HttpClient,
    private router: Router,
    private platform: Platform,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    localStorage.clear()
   
  }




  login(loginForm: NgForm): void {
    this.loggingIn = true;

    const email = loginForm.value.email;
    const password = loginForm.value.password;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const data = {
      correo: email,
      contrasena: password,
    };

    let serverUrl = 'http://192.168.1.120:3000/api/v1/user/loginApp';

    this.http.post(serverUrl, data, { headers }).subscribe(
      (response: any) => {
        console.log(response);
        this.loggingIn = false;
        this.id = response.data[0].id;
        this.nombre = response.data[0].nombre;
        this.apellido = response.data[0].ap_paterno;
        this.rol = response.data[0].id_rol;
        this.correo = response.data[0].correo;

        let extras: NavigationExtras = {
          state: {
            nombre: this.nombre,
            apellido: this.apellido,
            rol: this.rol,
            id: this.id,
            correo: this.correo,
          },
        };

        const rolNumero = parseInt(this.rol, 10);

        if (rolNumero === 2) {
          this.router.navigate(['/dashboard'], extras);
        } else {
          this.router.navigate(['/principal'], extras);
        }

        localStorage.setItem('nombre', JSON.stringify(this.nombre));
        localStorage.setItem('apellido', JSON.stringify(this.apellido));
        localStorage.setItem('rol', JSON.stringify(this.rol));
        localStorage.setItem('correo', JSON.stringify(this.correo));

        loginForm.reset();
      },
      (error) => {
        console.error(error);
        this.loggingIn = false;

        this.showAlert("Error,", "Correo o contraseña no son correctos")
      }
    );
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

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loggingIn = false;
  nombre: string = ''; //
  apellido: string = ''; //
  rol: string = ''; //
  correo: string = '';
  id: any = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private platform: Platform
  ) {}

  gOnInit() {
    localStorage.clear();
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

    let serverUrl = 'http://192.168.1.120:3000/api/v1/user/login'; // URL del servidor de desarrollo local

    this.http
      .post(serverUrl, data, { headers })
      .subscribe(
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
              correo: this.correo
            
          }}

          const rolNumero = parseInt(this.rol, 10); // Convertir this.rol a número

          if (rolNumero === 2){
            this.router.navigate(['dashboard'], extras)
          }else {
            this.router.navigate(['principal'], extras)
          }

          localStorage.setItem('nombre', JSON.stringify(this.nombre))
          localStorage.setItem('rol', JSON.stringify(this.rol))

        },
        (error) => {
          console.error(error);
          this.loggingIn = false;

          alert("Correo o contraseña incorrecto")
        }

        
        
      );

      
  }
}

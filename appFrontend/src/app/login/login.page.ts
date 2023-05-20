import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loggingIn = false;
  username: string = ''; //
  rol: string = ''; //

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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

    this.http
      .post('http://localhost:3000/api/v1/user/login', data, { headers })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.loggingIn = false;
          this.username = response.data[0].nombre;
          this.rol = response.data[0].id_rol;
          if (this.rol == "2"){
            this.router.navigate(['/dashboard', { username: this.username }]);
          }else{
            this.router.navigate(['/principal', { username: this.username }]);
          }
        },
        (error) => {
          console.error(error);
          this.loggingIn = false;

          alert("Correo o contraseña incorrecto")
        }
      );
  }
}

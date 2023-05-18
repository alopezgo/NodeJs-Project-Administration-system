import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loggingIn = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
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

          // Establecer el correo electrónico actual y redirigir al usuario a la página de dashboard
          this.authService.setCurrentUserEmail(email);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error(error);
          this.loggingIn = false;

          alert("Correo o contraseña incorrecto")
        }
      );
  }
}

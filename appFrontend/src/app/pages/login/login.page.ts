import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  username: string;
  password: string;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController
  ) {
    this.username = '';
    this.password = '';
  }

  login() {
    const data = {
      username: this.username,
      password: this.password
    };

    this.http.post('https://ejemplo.com/api/login', data).subscribe((response: any) => {
      if (response.token) {
        this.storage.set('token', response.token).then(() => {
          this.navCtrl.navigateRoot('/home');
        });
      } else {
        // Si la API devuelve un mensaje de error, lo mostramos en la pantalla
        console.log(response.message);
      }
    });
  }
}
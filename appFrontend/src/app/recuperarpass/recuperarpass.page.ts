import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';   

@Component({
  selector: 'app-recuperarpass',
  templateUrl: './recuperarpass.page.html',
  styleUrls: ['./recuperarpass.page.scss'],
})
export class RecuperarpassPage implements OnInit {

  private apiUrl = 'http://192.168.1.120:3000/api/v1/usuarios/recovery'; // URL del servidor de desarrollo local

  constructor(private http: HttpClient, private router:Router, private navCtrl: NavController) {}
  
  ngOnInit(){
  }



  async onSubmit(form: NgForm) {
    if (form.valid) {
      const newMail = form.value.newMail;

      try {
        const response = await this.recovery(newMail);
        console.log(response); 
        alert('El correo fue enviado a la casilla indicada')
        this.router.navigate(['login'])
      } catch (error) {
        console.error(error); // Manejar el error, como mostrar un mensaje de error al usuario
      }
    }
  }

  private async recovery(newMail: string): Promise<any> {
    const data = { newMail };

    try {
      const response = await this.http.post(this.apiUrl, data).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  goBack(): void {
    this.navCtrl.back();
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['login'])
  }
}
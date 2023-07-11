import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {
  nombre: string = '';
  id: any = '';
  contrasenaActual: string = '';
  nuevaContrasena: string = '';

  constructor(private router: Router, private http: HttpClient, private navCtrl: NavController,private alertController: AlertController) {}

  ngOnInit() {
    try {
      const navigationState = this.router.getCurrentNavigation();
      if (navigationState?.extras?.state) {
        this.nombre = navigationState.extras.state['nombre'];
        this.id = navigationState.extras.state['id'];
      } else {
        this.router.navigate(['perfil']);
      }
    } catch (error) {
      this.router.navigate(['perfil']);
    }
  }

  async actualizarContrasena() {
    try {
      const body = {
        contrasena_actual: this.contrasenaActual,
        nueva_contrasena: this.nuevaContrasena,
      };

      const url = `http://192.168.52.22:3000/api/v1/usuarios/${this.id}/updatePass`;

      const response = await this.http.put<UpdatePasswordResponse>(url, body).toPromise();

      if (response && response.success) {
        console.log(response.message);
        this.showAlert('Exito', 'Contraseña actualizada correctamente')
        this.router.navigate(['perfil']);
      } else {
        console.error(response?.message || 'Error al actualizar la contraseña');
        this.showAlert('Error', 'Contraseña demasiado simple')

      }
    } catch (error) {
      console.error('Error al actualizar contraseña', error);
    }
  }

  goBack(): void {
    this.navCtrl.back();
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

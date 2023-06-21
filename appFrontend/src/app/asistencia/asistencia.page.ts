import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {




  asistencia: number = 0;

  constructor(private http: HttpClient, private navCtrl: NavController, private router:Router) {
   
  }
  ngOnInit() {
  }


  addAsistencia(id_asistencia:number){
    this.asistencia = id_asistencia;

    let extras: NavigationExtras = {
      state: {
        pass: this.asistencia,
      }
    }
    if (this.asistencia == 1){
      this.router.navigate(['entrada'], extras);
    }     
    if (this.asistencia == 2){
      this.router.navigate(['salida'], extras);
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

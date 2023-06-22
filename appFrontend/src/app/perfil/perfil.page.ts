import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  nombre:string= '';
  apellido:string | null = '';
  correo:string = '';
  id: any = '';
  rol : string| null= '';




  constructor(private router:Router,private navCtrl: NavController) { }

  ngOnInit() {
    
    try {
      const navigationState = this.router.getCurrentNavigation();
      if (navigationState?.extras?.state) {
        this.nombre = navigationState.extras.state['nombre'];
        this.apellido = navigationState.extras.state['apellido'];
        this.correo = navigationState.extras.state['correo'];
        this.id = navigationState.extras.state['id'];
        this.rol = navigationState.extras.state['rol'];

        this.rol = JSON.parse(localStorage.getItem('rol') || '{}');
        this.apellido = JSON.parse(localStorage.getItem('apellido') || '{}');
        this.correo = JSON.parse(localStorage.getItem('correo') || '{}');

       

      
        
        
      } else {
        this.router.navigate(['dashboard']);
      }
    } catch (error) {
      this.router.navigate(['dashboard']);
    }
  }
  
  
  goToRecovery(){  
    let extras: NavigationExtras = {
      state: {
        nombre: this.nombre,
        apellido: this.apellido,
        id: this.id,
        rol:this.rol
      
    }}
        this.router.navigate(['recovery'], extras)
      }

    goToDashboard(){  
      
      let extras: NavigationExtras = {
        state: {
          nombre: this.nombre,
          apellido : this.apellido,
          id: this.id,
          rol:this.rol
        
      }}  
    
      const rolNumero = parseInt(this.rol ?? '0', 10); // Convertir this.rol a número, si es nulo, se utiliza '0' como valor predeterminado

      if (rolNumero === 2) {
        this.router.navigate(['dashboard'], extras);
      } else if (this.rol?.toString() === '3') {
        this.router.navigate(['principal'], extras);
      } else {
        alert("Rol incorrecto");
      }
      
          
        }

        
  goBack(): void {
    this.navCtrl.back();
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['home'])
  }

}

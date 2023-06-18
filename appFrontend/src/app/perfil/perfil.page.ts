import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  nombre:string= '';
  apellido:string = '';
  correo:string = '';
  id: any = '';
  rol : string| null= '';

 



  constructor(private router:Router) { }

  ngOnInit() {
    try {
      const navigationState = this.router.getCurrentNavigation();
      if (navigationState?.extras?.state) {
        this.nombre = navigationState.extras.state['nombre'];
        this.apellido = navigationState.extras.state['apellido'];
        this.correo = navigationState.extras.state['correo'];
        this.id = navigationState.extras.state['id'];
        this.rol = navigationState.extras.state['rol'];
        
        
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

}

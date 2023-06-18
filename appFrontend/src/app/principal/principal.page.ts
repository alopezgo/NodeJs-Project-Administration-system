import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  nombre:string | null= '';
  apellido:string| null= '';
  correo: string| null= '';
  id: any = '';
  rol : string| null= '';


  constructor(private activatedRoute: ActivatedRoute, private router:Router) {}

  ngOnInit() {

  
      try {
        const navigationState = this.router.getCurrentNavigation();
        if (navigationState?.extras?.state) {
          this.nombre = navigationState.extras.state['nombre'];
          this.apellido = navigationState.extras.state['apellido'];
          this.id = navigationState.extras.state['id'];
          this.correo = navigationState.extras.state['correo'];
          this.rol = navigationState.extras.state['rol'];
        } else {
          this.router.navigate(['principal']);
        }
      } catch (error) {
        this.router.navigate(['principal']);
      }

 }

  

  goToPerfil(){  
    let extras: NavigationExtras = {
      state: {
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        rol: this.rol,
        id: this.id
      
    }}
        this.router.navigate(['perfil'], extras)
      }

    
    }
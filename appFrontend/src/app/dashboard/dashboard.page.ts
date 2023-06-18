import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  nombre:string | null= '';
  apellido:string| null= '';
  correo: string| null= '';
  id: any = '';
  rol : string| null= '';


  constructor(private activatedRoute: ActivatedRoute, private router:Router) {}

  ngOnInit() {

    this.nombre = localStorage.getItem('nombre')

  
      try {
        const navigationState = this.router.getCurrentNavigation();
        if (navigationState?.extras?.state) {
          this.nombre = navigationState.extras.state['nombre'];
          this.apellido = navigationState.extras.state['apellido'];
          this.id = navigationState.extras.state['id'];
          this.correo = navigationState.extras.state['correo'];
          this.rol = navigationState.extras.state['rol'];
        } else {
          this.router.navigate(['perfil']);
        }
      } catch (error) {
        this.router.navigate(['perfil']);
      }

 }

  

  goToPerfil(){  
    let extras: NavigationExtras = {
      state: {
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        id: this.id,
        rol: this.rol
      
    }}
        this.router.navigate(['perfil'], extras)
      }
      
    
  }

   
    
  


  



  
  
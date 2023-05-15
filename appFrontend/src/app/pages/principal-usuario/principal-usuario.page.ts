import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-principal-usuario',
  templateUrl: './principal-usuario.page.html',
  styleUrls: ['./principal-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrincipalUsuarioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

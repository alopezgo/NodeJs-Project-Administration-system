import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-principal-empresa',
  templateUrl: './principal-empresa.page.html',
  styleUrls: ['./principal-empresa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrincipalEmpresaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

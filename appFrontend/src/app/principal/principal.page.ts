import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  username: string | null= '';


  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.username = this.activatedRoute.snapshot.paramMap.get('username') || null;
  


  }}

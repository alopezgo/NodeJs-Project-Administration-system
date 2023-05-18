import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  currentUserEmail: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUserEmail = this.authService.getCurrentUserEmail();
    console.log('nombre' ,this.currentUserEmail);

  }
}

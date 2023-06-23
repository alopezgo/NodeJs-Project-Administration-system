import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}

  ngOnInit() {
    if (
      localStorage.getItem('rol') != null &&
      localStorage.getItem('rol') === '2'
    ) {
      this.router.navigate(['/dashboard']);
    } else if (
      localStorage.getItem('rol') != null &&
      localStorage.getItem('rol') === '3'
    ) {
      this.router.navigate(['/principal']);
    } else {
      localStorage.clear();
    }
  }

}

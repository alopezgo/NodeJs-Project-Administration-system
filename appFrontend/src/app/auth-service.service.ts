import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserEmail: string = '';

  constructor() { }

  getCurrentUserEmail(): string {
    return this.currentUserEmail;
  }

  setCurrentUserEmail(email: string): void {
    this.currentUserEmail = email;
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  user: string = '';

  password: string = '';

  showToast = false;

  showAvailableToast = false;

  showInvalidPasswordToast = false;

  isError = false;

  isInfo = false;

  constructor(
    private router: Router,
    private globalService: GlobalService
  ) { }

  navigateTo(route: string): void {
    if (route === '/home') {
      if (this.user && this.password) {
        this.router.navigateByUrl(route);
      } else {
        this.showToast = true;
        this.isError = true;
        setTimeout(() => this.showToast = false, 3000);
      }
    } else {
      this.router.navigateByUrl(route);
    }
  }

  updateUser(value: string): void {
    if (1 == 1) {
      // TODO -- QUERY consultar existencia de username en base de datos
      // expected return: 1 = exists, 0 = no match.
      this.showAvailableToast = true;
      this.isInfo = true;
      setTimeout(() => this.showToast = false, 3000);
      this.isInfo = false;
    } else {
      this.showAvailableToast = true;
      this.isError = true;
      setTimeout(() => this.showToast = false, 3000);
      this.isError = false;
    }
    this.globalService.username = this.user;
  }

  updatePassword(value: string): void {
    if (1 == 1) {
      this.password = value;
    } else {
      this.showInvalidPasswordToast = true;
      this.isError = true;
      setTimeout(() => this.showToast = false, 3000);
      this.isError = false;
    }
  }
}

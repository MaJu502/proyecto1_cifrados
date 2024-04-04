import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: string = '';

  password: string = '';

  showToast = false;

  isError = false;

  constructor(
    private router: Router,
    private globalService: GlobalService
    ) { }

  navigateTo(route: string): void {
    if (route === '/inbox') {
      // Proceso de verificación de usuario
      if (this.user && this.password) {
        this.globalService.setUsername(this.user);
        this.globalService.setPrivateKey(this.password);
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

  updatePassword(value: string): void {
    this.password = value;
  }
}

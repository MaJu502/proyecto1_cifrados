import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  registered_users: any[] = [];

  user: string = '';

  password: string = '';

  showToast = false;

  showAvailableToast = false;

  showInvalidPasswordToast = false;

  isError = false;

  isInfo = false;

  usernameExists: boolean = false;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log('funciona el on init')
    this.loadUsers();
    console.log('llamo a load users')
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (data) => {
        this.registered_users = data;
        console.log('usuarios encontrados con exito! Estos son:\n', this.registered_users)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  navigateTo(route: string): void {
    if (route === '/home') {
      if (this.user && this.password) {
        if (this.usernameExists) {
          console.log('Username is taken.');
          this.showAvailableToast = false;
          this.isError = true;
          setTimeout(() => {
            this.showToast = false;
            this.isError = false;
          }, 3000);
        } else {
          // Usuario si está disponible se genera llave publica y privada
          //PRIVADA

          // DOWNLOAD PRIVADA EN TXT

          //PUBLICA

          this.router.navigateByUrl(route);
        }
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
    this.usernameExists = this.registered_users.some(user => user.username === value);
    this.user = value;
  }

  updatePassword(value: string): void {
    this.password = value;
  }
}

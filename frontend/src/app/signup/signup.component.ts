import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';


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

  private_key: string = '';

  public_key: string = '';

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
    if (route === '/inbox') {
      if (this.user) {
        if (this.usernameExists) {
          console.log('Username is taken.');
          this.showAvailableToast = false;
          this.isError = true;
          setTimeout(() => {
            this.showToast = false;
            this.isError = false;
          }, 3000);
        } else {
          //PRIVADA Y PUBLICA
          this.private_key = CryptoJS.lib.WordArray.random(16).toString();
          this.public_key = CryptoJS.lib.WordArray.random(16).toString();


          // Prepare the data
          const userData = {
            public_key: this.public_key,
            username: this.user
          };

          // Send the data to the server
          this.http.post('http://localhost:3000/users', userData).subscribe({
            next: (response) => {
              // Handle the success scenario
              console.log(response);
              // Redirect to the inbox route
              this.router.navigateByUrl(route);
            },
            error: (error) => {
              // Handle the error scenario
              console.error('There was an error!', error);
            }
          });

          // DOWNLOAD PRIVADA EN TXT
          const blob = new Blob([this.private_key], { type: 'text/plain' });
          const anchor = document.createElement('a');
          anchor.download = 'private_key.txt';
          anchor.href = window.URL.createObjectURL(blob);
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);

          // REDIRECT DE RUTA
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

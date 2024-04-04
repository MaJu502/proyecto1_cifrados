import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as Forge from 'node-forge';


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
          // Generate key pair
          let pair = Forge.pki.rsa.generateKeyPair(2048, 0x10001);

          // Convert keys to PEM format
          let pemPrivateKey = Forge.pki.privateKeyToPem(pair.privateKey);
          let pemPublicKey = Forge.pki.publicKeyToPem(pair.publicKey);

          // Remove the '-----BEGIN PUBLIC KEY-----' and '-----END PUBLIC KEY-----'
          let publicKeyStr = pemPublicKey.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\n/g, '');
          let privateKeyStr = pemPrivateKey.replace('-----BEGIN RSA PRIVATE KEY-----', '').replace('-----END RSA PRIVATE KEY-----', '').replace(/\n/g, '');

          // Remove all occurrences of '\r'
          this.private_key = privateKeyStr.replace(/\r/g, '');
          this.public_key = publicKeyStr.replace(/\r/g, '');

          console.log('Public key to send:', this.public_key);

          // Prepare the data
          const userData = {
            public_key: this.public_key,
            username: this.user
          };

          this.globalService.setUsername(this.user);

          // Send the data to the server
          this.http.post('http://localhost:3000/users', userData).subscribe({
            next: (response) => {
              // Handle the success scenario
              console.log(response);
              // Redirect to the inbox route
              this.router.navigateByUrl('/login');
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
          this.router.navigateByUrl('/login');
        }
      } else {
        this.showToast = true;
        this.isError = true;
        setTimeout(() => this.showToast = false, 3000);
      }
    } else {
      this.router.navigateByUrl('/login');
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

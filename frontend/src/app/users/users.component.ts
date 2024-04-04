import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as Forge from 'node-forge';

interface KeyResponse {
  key: string;
}


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SidebarComponent, FormsModule, NgIf, HttpClientModule, NgFor],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent implements OnInit {
  username: string = '';
  publicKey: string = '';
  privateKey: string = '';
  registered_users: any[] = [];
  selectedUser: string = ''; // Nueva propiedad para almacenar el usuario seleccionado
  message: string = ''; // Nueva propiedad para almacenar el mensaje a enviar

  constructor(private route: ActivatedRoute, private globalService: GlobalService, private http: HttpClient) { }
  

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
    console.log('termina loadusers')
  }

  getUserKey(username: string): void {
    this.http.get<KeyResponse>('http://localhost:3000/users/' + username + '/key').subscribe({
      next: (data) => {
        console.log('Respuesta del servidor:', data);
        this.publicKey = data.key; // Obtiene la clave de la respuesta
        console.log('Clave pública obtenida con éxito:', this.publicKey);
      },
      error: (error) => {
        console.error('Hubo un error al obtener la clave pública:', error);
      }
    });
  }  


  // Nueva función para manejar el envío del formulario
  sendMessage(event: Event, username: string): void {
    event.preventDefault();
  
    // Encripta el mensaje usando la clave pública del usuario
    const publicKey = Forge.pki.publicKeyFromPem(this.publicKey);
    const encryptedMessage = publicKey.encrypt(this.message, 'RSA-OAEP');
  
    this.http.post('http://localhost:3000/messages/' + username, { message: encryptedMessage, origin: this.username }).subscribe({
      next: (data) => {
        console.log('Mensaje enviado con éxito:', data);
      },
      error: (error) => {
        console.error('Hubo un error al enviar el mensaje:', error);
      }
    });
  }
  

  ngOnInit(): void {
    console.log('funciona el on init')
    this.loadUsers();
    // Obtén el username del Local Storage
    this.username = localStorage.getItem('username') || '';

    if (this.username) {
      this.getUserKey(this.username); // Obtén la clave pública del usuario actual
    }
    console.log('llamo a load users')
  }

}

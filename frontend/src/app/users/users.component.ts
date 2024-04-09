import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as forge from 'node-forge';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SidebarComponent, FormsModule, NgIf, HttpClientModule, NgFor],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  registered_users: any[] = [];

  username: string = '';

  privateKey: string = '';

  messages: any[] = [];

  dmMessages: any[] = [];

  messageContent: string = '';

  currentRecipient: string = '';

  privateKeyrec: string = '';

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

  decryptMessagesUsers(): void {
    console.log('decryptMessage iniciado');
    let privateKeyPem = '-----BEGIN PRIVATE KEY-----\n' + this.privateKeyrec + '\n-----END PRIVATE KEY-----';
    console.log('Clave privada en formato PEM: ' + privateKeyPem);
    let privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  
    console.log('mensajes a ver si existen aun:\n', this.dmMessages)
    this.dmMessages.forEach((message, index) => {
      if (message.mensaje_cifrado) { // Cambia 'content' a 'mensaje_cifrado'
        try {
          console.log('Desencriptando mensaje ' + index + ': ' + message.mensaje_cifrado); // Cambia 'content' a 'mensaje_cifrado'
          let encryptedMessage = forge.util.decode64(message.mensaje_cifrado); // Cambia 'content' a 'mensaje_cifrado'
          message.mensaje_cifrado = privateKey.decrypt(encryptedMessage, 'RSA-OAEP'); // Cambia 'content' a 'mensaje_cifrado'
          console.log('Mensaje desencriptado: ' + message.mensaje_cifrado); // Cambia 'content' a 'mensaje_cifrado'
        } catch (error) {
          console.error('Error al desencriptar el mensaje ' + index, error);
        }
      }
    });
  }

  // Nueva función para cargar los mensajes de un usuario específico
  loadUserMessages(origin: string, dest: string): void {
    this.currentRecipient = origin;
    this.http.get<any[]>('http://localhost:3000/messages/' + origin + '/users/' + dest).subscribe({
      next: (data) => {
        const messagesMap = new Map();
        this.dmMessages.forEach(message => messagesMap.set(message.id, message));
        data.forEach(message => messagesMap.set(message.id, message));
        this.dmMessages = Array.from(messagesMap.values());
        this.dmMessages.sort((a, b) => a.id - b.id);
        console.log('mensajes encontrados con exito! Estos son:\n', this.dmMessages)
        this.decryptMessagesUsers();
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
    console.log('termina loadUserMessages')

    this.http.get<any[]>('http://localhost:3000/messages/' + dest + '/users/' + origin).subscribe({
      next: (data) => {
        const messagesMap = new Map();
        this.dmMessages.forEach(message => messagesMap.set(message.id, message));
        data.forEach(message => messagesMap.set(message.id, message));
        this.dmMessages = Array.from(messagesMap.values());
        this.dmMessages.sort((a, b) => a.id - b.id);
        console.log('mensajes encontrados con exito! Estos son:\n', this.dmMessages)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });

    // DESENCRIPTAR

    console.log('termina loadUserMessages')
  }

  clearMessages(): void {
    this.dmMessages = [];
    this.currentRecipient = '';
  }

  async getUserPublicKey(username: string): Promise<string> {
    const response = await this.http.get(`http://localhost:3000/users/${username}/key`, { responseType: 'text' }).toPromise();
    if (response !== undefined) {
      return response;
    } else {
      throw new Error('No se pudo obtener la clave pública del usuario');
    }
  }

  async sendMessage() {
    if (this.currentRecipient && this.messageContent) {
      try {
        // Obtener la clave pública del destinatario
        const publicKeyString = await this.getUserPublicKey(this.currentRecipient);

        // Convertir la clave pública a formato PEM
        const publicKeyPem = '-----BEGIN PUBLIC KEY-----\n' + publicKeyString + '\n-----END PUBLIC KEY-----';

        // Convertir la clave PEM a formato de node-forge
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

        console.log('Datos originales: ' + this.messageContent);

        // Encriptar el mensaje con la clave pública
        let encryptedMessage = publicKey.encrypt(this.messageContent, 'RSA-OAEP');

        // Convertir a base64
        let encryptedMessageBase64 = forge.util.encode64(encryptedMessage);

        console.log('Datos Encriptados: ' + encryptedMessageBase64);

        // Crear los datos del correo
        const mailData = {
          message: encryptedMessageBase64,
          origin: this.username
        };

        // Enviar el correo
        const apiUrl = 'http://localhost:3000/messages/' + this.currentRecipient;
        this.http.post(apiUrl, mailData)
          .subscribe(response => {
            console.log('Correo enviado exitosamente', response);
          }, error => {
            console.error('Error al enviar el correo', error);
          });
      } catch (error) {
        console.error('Error al obtener la clave pública del destinatario', error);
      }
      const recipientTemp = this.currentRecipient
      setTimeout(() => {
        this.loadUserMessages(recipientTemp, this.username);
        console.log('Mensajes recargados');
      }, 500);
      this.messageContent = '';
      this.currentRecipient = '';
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    this.username = localStorage.getItem('username') || '';
    this.privateKeyrec = localStorage.getItem('privateKey') || '';

  }

}

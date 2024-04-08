import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as forge from 'node-forge';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { GlobalService } from '../services/global.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-compose-mails',
  standalone: true,
  imports: [FormsModule, HttpClientModule, SidebarComponent, NgIf],
  templateUrl: './compose-mails.component.html',
  styleUrl: './compose-mails.component.scss'
})
export class ComposeMailsComponent implements OnInit{
  username: string = '';
  privateKey: string = '';
  recipient: string = '';
  messageContent: string = '';
  messageType: string = 'DM';
  groupID: number = 0;
  groupKey: string = '';

  constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) { }
  
  ngOnInit(): void {
    this.username = this.globalService.getUsername() || '';
    this.privateKey = this.globalService.getPrivateKey() || '';
  }

  async getUserPublicKey(username: string): Promise<string> {
    const response = await this.http.get(`http://localhost:3000/users/${username}/key`, {responseType: 'text'}).toPromise();
    if (response !== undefined) {
      return response;
    } else {
      throw new Error('No se pudo obtener la clave pública del usuario');
    }
  }

  sendMessage() {
    this.messageType === 'DM' ? this.sendMail() : this.sendGroupMessage();
  }

  async sendGroupMessage() {
    if (this.groupID && this.messageContent && this.groupKey) {
      try {
        const cipher = forge.cipher.createCipher('AES-ECB', this.groupKey);
        cipher.start({ iv: '' });
        cipher.update(forge.util.createBuffer(this.messageContent, 'utf8'));
        cipher.finish();
        const encryptMessage = cipher.output.toHex();

        const mailData = {
          id_grupo: this.groupID,
          author: this.username,
          mensaje_cifrado: encryptMessage
        };

        const apiUrl = 'http://localhost:3000/groupMessages/groups';
        this.http.post(apiUrl, mailData)
          .subscribe(response => {
            console.log('Correo enviado exitosamente', response);
            this.messageContent = '';
          this.recipient = '';
          this.router.navigateByUrl('/inbox');
        }, error => {
            console.error('Error al enviar el correo', error);
        });

      } catch (error) {
        console.error('Error al obtener la clave pública del destinatario', error);
      }
    } else {
      alert('Por favor, complete todos los campos antes de enviar el correo.');
    }
  }

  async sendMail() {
    if (this.recipient && this.messageContent) {
      try {
        // Obtener la clave pública del destinatario
        const publicKeyString = await this.getUserPublicKey(this.recipient);

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
        const apiUrl = 'http://localhost:3000/messages/' + this.recipient;
        this.http.post(apiUrl, mailData)
          .subscribe(response => {
            console.log('Correo enviado exitosamente', response);
            this.messageContent = '';
          this.recipient = '';
          this.router.navigateByUrl('/inbox');
        }, error => {
            console.error('Error al enviar el correo', error);
          });
      } catch (error) {
        console.error('Error al obtener la clave pública del destinatario', error);
      }
    } else {
      alert('Por favor, complete todos los campos antes de enviar el correo.');
    }
  }
}

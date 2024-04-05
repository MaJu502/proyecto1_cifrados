import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as forge from 'node-forge';

@Component({
  selector: 'app-compose-mails',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './compose-mails.component.html',
  styleUrl: './compose-mails.component.scss'
})
export class ComposeMailsComponent {
  recipient: string = '';
  messageContent: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  async getUserPublicKey(username: string): Promise<string> {
    const response = await this.http.get(`http://localhost:3000/users/${username}/key`, {responseType: 'text'}).toPromise();
    if (response !== undefined) {
      return response;
    } else {
      throw new Error('No se pudo obtener la clave pública del usuario');
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
          origin: 'usuario1'
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

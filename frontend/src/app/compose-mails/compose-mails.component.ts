import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient) { }

  sendMail() {
    if (this.recipient && this.messageContent) {
      const mailData = {
        message: this.messageContent,
        origin: 'usuario1'
      };
      // Cambia la URL según tus necesidades
      const apiUrl = 'http://localhost:3000/messages/' + this.recipient;
      this.http.post(apiUrl, mailData)
        .subscribe(response => {
          console.log('Correo enviado exitosamente', response);
        }, error => {
          console.error('Error al enviar el correo', error);
        });
    } else {
      alert('Por favor, complete todos los campos antes de enviar el correo.');
    }
  }
}

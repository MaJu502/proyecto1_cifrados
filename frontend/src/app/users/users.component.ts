import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';


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
    console.log('termina loadUserMessages')
  }

  clearMessages(): void {
    this.dmMessages = [];
    this.currentRecipient = '';
  }

  sendMessage(): void {
    console.log('destino: ', this.currentRecipient);
    if (this.currentRecipient && this.messageContent) {
      const mailData = {
        message: this.messageContent,
        origin: this.username
      };
      const apiUrl = 'http://localhost:3000/messages/' + this.currentRecipient;
      this.http.post(apiUrl, mailData)
        .subscribe(response => {
          console.log('Correo enviado exitosamente', response);
          this.messageContent = '';
        }, error => {
          console.error('Error al enviar el correo', error);
        });
    }
    setTimeout(() => {
      this.loadUserMessages(this.currentRecipient, this.username);
      console.log('Mensajes recargados');
    }, 500);
  }

  ngOnInit(): void {
    this.loadUsers();
    this.username = localStorage.getItem('username') || '';
  }

}

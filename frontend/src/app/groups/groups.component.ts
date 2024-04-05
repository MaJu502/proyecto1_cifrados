import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [SidebarComponent, FormsModule, NgIf, HttpClientModule, NgFor, NgClass],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit {
  registered_groups: any[] = [];

  username: string = '';

  privateKey: string = '';

  messages: any[] = []; // Nueva propiedad para almacenar los mensajes

  messageContent: string = '';

  currentGroupName: string = '';

  currentGroupID: string = '';

  constructor(private route: ActivatedRoute, private globalService: GlobalService, private http: HttpClient) { }

  loadGroups(): void {
    this.http.get<any[]>('http://localhost:3000/groups').subscribe({
      next: (data) => {
        this.registered_groups = data;
        console.log('grupos encontrados con exito! Estos son:\n', this.registered_groups)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
    console.log('termina loadgroups')
  }

  loadGroupMessages(groupID: string, groupName: string): void {
    this.currentGroupName = groupName;
    this.currentGroupID = groupID;
    this.http.get<any[]>('http://localhost:3000/messages/groups/' + groupID).subscribe({
      next: (data) => {
        const messagesMap = new Map();
        this.messages.forEach(message => messagesMap.set(message.id, message));
        data.forEach(message => messagesMap.set(message.id, message));
        this.messages = Array.from(messagesMap.values());
        this.messages.sort((a, b) => a.id - b.id);

        // DESENCRIPTAR

        console.log('mensajes encontrados con exito! Estos son:\n', this.messages)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
    console.log('termina loadGroupMessages')
  }

  clearMessages(): void {
    this.messages = [];
    this.currentGroupName = '';
    this.currentGroupID = '';
  }

  sendMessage(): void {
    console.log('destino: ', this.currentGroupName);
    if (this.currentGroupName && this.messageContent) {

      //ENCRIPTAR

      const mailData = {
        id_grupo: this.currentGroupID,
        author: this.username,
        mensaje_cifrado: this.messageContent
      };
      const apiUrl = 'http://localhost:3000/messages/groups';
      this.http.post(apiUrl, mailData)
        .subscribe(response => {
          console.log('Mensaje enviado exitosamente', response);
          this.messageContent = '';
          setTimeout(() => {
            this.loadGroupMessages(this.currentGroupID, this.currentGroupName);
            console.log('Mensajes recargados');
          }, 500);
        }, error => {
          console.error('Error al enviar el mensaje', error);
        });
    } else {
      console.log('Debe especificar un grupo y un mensaje.');
    }
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.loadGroups();
  }

}

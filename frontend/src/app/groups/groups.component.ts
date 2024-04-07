import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as forge from 'node-forge';

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

  flagCrearGrupo: boolean = false;

  registered_users: any[] = [];

  searchText: string = '';

  filteredUsers: any[] = [];

  groupPasswordDelete: string = '';

  newGroup: any = {
    nombre: '',
    password: '',
    clave_simetrica: '',
    username: '',
    users: []
  };
  constructor(private route: ActivatedRoute, private globalService: GlobalService, private http: HttpClient) { }

  async getGroupKey(group: string): Promise<string> {
    const response = await this.http.get(`http://localhost:3000/groupsKey/${group}`, {responseType: 'text'}).toPromise();
    if (response !== undefined) {
      return response;
    } else {
      throw new Error('No se pudo obtener la clave pública del grupo');
    }
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

  filterUsers(): void {
    if (this.searchText) {
      this.filteredUsers = this.registered_users.filter(user =>
        user.username.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredUsers = [];
    }
  }

  addUserToGroup(username: string): void {
    if (!this.newGroup.users.includes(username)) {
      this.newGroup.users.push(username);
    }
    this.searchText = '';
  }

  removeUserFromGroup(username: string): void {
    const index = this.newGroup.users.indexOf(username);
    if (index > -1) {
      this.newGroup.users.splice(index, 1);
    }
  }

  closeSuggestions(): void {
    this.searchText = '';
    this.filteredUsers = [];
  }

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

  async loadGroupMessages(groupID: string, groupName: string) {
    this.currentGroupName = groupName;
    this.currentGroupID = groupID;
    const groupKey = await this.getGroupKey(this.currentGroupName);
    this.http.get<any[]>('http://localhost:3000/messages/groups/' + groupID).subscribe({
      next: (data) => {
        const messagesMap = new Map();
        this.messages.forEach(message => messagesMap.set(message.id, message));
        data.forEach(message => messagesMap.set(message.id, message));
        this.messages = Array.from(messagesMap.values());
        this.messages.sort((a, b) => a.id - b.id);

        this.messages.forEach(message => {
          const decipher = forge.cipher.createDecipher('AES-ECB', groupKey);
          decipher.start({ iv: '' });
          decipher.update(forge.util.createBuffer(forge.util.hexToBytes(message.mensaje_cifrado)));
          decipher.finish();
          message.mensaje_cifrado = decipher.output.toString();
        });

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

  async sendMessage() {
    if (this.currentGroupName && this.messageContent) {
      const groupKey = await this.getGroupKey(this.currentGroupName);
      const cipher = forge.cipher.createCipher('AES-ECB', groupKey);
      cipher.start({ iv: '' });
      cipher.update(forge.util.createBuffer(this.messageContent, 'utf8'));
      cipher.finish();
      const encryptMessage = cipher.output.toHex();

      const mailData = {
        id_grupo: this.currentGroupID,
        author: this.username,
        mensaje_cifrado: encryptMessage
      };
      const apiUrl = 'http://localhost:3000/groupMessages/groups';
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

  eliminarGrupo(groupName: string): void {
    if (groupName && this.groupPasswordDelete) {
      const apiUrl = 'http://localhost:3000/groups/' + groupName;
      this.http.delete(apiUrl)
        .subscribe(response => {
          console.log('Eliminado exitosamente', response);
          this.messageContent = '';
          setTimeout(() => {
            this.loadGroups();
            console.log('Mensajes recargados');
          }, 500);
        }, error => {
          console.error('Error al enviar el mensaje', error);
        });
    }
  }

  toggleCrearGrupos(): void {
    console.log('Crear nuevo grupo');
    if (this.flagCrearGrupo == false) {
      this.flagCrearGrupo = true;
    } else {
      this.flagCrearGrupo = false;
    }

    // Reset campos de crear
    this.newGroup.nombre = '',
    this.newGroup.password = '',
    this.newGroup.clave_simetrica = '',
    this.newGroup.username = '',
    this.newGroup.users = []

    console.log('elementos: ', this.newGroup.users)
  }

  crearGrupo(): void {
    console.log('Crear nuevo grupo:', this.newGroup);
  }

  // Generar una clave AES-128
  generateAESKey() {
    return forge.random.getBytesSync(16); // 16 bytes = 128 bits
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.loadUsers();
    this.loadGroups();
  }

}

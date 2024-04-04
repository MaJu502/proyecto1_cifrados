import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as Forge from 'node-forge';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [SidebarComponent, FormsModule, NgIf, HttpClientModule, NgFor],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent implements OnInit {
  username: string = '';
  privateKey: string = '';
  messages: any[] = []; // Nueva propiedad para almacenar los mensajes

  constructor(private route: ActivatedRoute, private globalService: GlobalService, private http: HttpClient) { }

  // Nueva función para cargar los mensajes del servidor
  loadMessages(): void {
    console.log('this.username:\n', this.username)
    this.http.get<any[]>('http://localhost:3000/messages/' + this.username).subscribe({
      next: (data) => {
        this.messages = data;
        console.log('mensajes encontrados con exito! Estos son:\n', this.messages)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
    console.log('termina loadMessages')
  }
  
  // Nueva función para cargar los mensajes de un usuario específico
  loadUserMessages(origin: string, dest: string): void {
    this.http.get<any[]>('http://localhost:3000/messages/' + origin + '/users/' + dest).subscribe({
      next: (data) => {
        this.messages = data;
        console.log('mensajes encontrados con exito! Estos son:\n', this.messages)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
    console.log('termina loadUserMessages')
  }

  ngOnInit(): void {
    console.log('funciona el on init')

    // Obtén el username del Local Storage
    this.username = localStorage.getItem('username') || '';

    this.loadMessages(); // Llama a la nueva función
    console.log('llamo a load messages')

    }
}

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
    this.loadUsers();
    this.username = localStorage.getItem('username') || '';
  }

}

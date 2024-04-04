import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [SidebarComponent, FormsModule, NgIf, HttpClientModule, NgFor],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit {
  registered_groups: any[] = [];

  username: string = '';

  privateKey: string = '';

  messages: any[] = []; // Nueva propiedad para almacenar los mensajes

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

  loadGroupMessages(groupID: string): void {
    this.http.get<any[]>('http://localhost:3000/messages/groups/' + groupID).subscribe({
      next: (data) => {
        this.messages = data;
        console.log('mensajes encontrados con exito! Estos son:\n', this.messages)
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
    console.log('termina loadGroupMessages')
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.loadGroups();
  }

}

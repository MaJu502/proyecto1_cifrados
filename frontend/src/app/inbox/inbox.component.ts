import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent implements OnInit {
  username: string = '';
  privateKey: string = '';

  constructor(private route: ActivatedRoute, private globalService: GlobalService) {}

  ngOnInit() {
    this.username = this.globalService.getUsername() || '';
    this.privateKey = this.globalService.getPrivateKey() || '';
    if (!this.username && !this.privateKey) {
      this.route.params.subscribe(params => {
        this.username = params['username'] || '';
        this.privateKey = params['privateKey'] || '';
      });
    }
  }
}
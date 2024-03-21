import { Component } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { GlobalService } from '../services/global.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isCollapsed = false;

  dropdownOpen: string | null = null;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown(menu: string): void {
    this.dropdownOpen = this.dropdownOpen === menu ? null : menu;
  }
}

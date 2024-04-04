import { Component, Input } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() username: string | null = null;
  @Input() privateKey: string | null = null;
  
  isCollapsed = false;

  dropdownOpen: string | null = null;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown(event: MouseEvent, menu: string): void {
    event.preventDefault();
    this.dropdownOpen = this.dropdownOpen === menu ? null : menu;
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}

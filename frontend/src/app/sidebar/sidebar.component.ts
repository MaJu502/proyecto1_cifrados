import { Component, Input } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Forge from 'node-forge';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, CommonModule, HttpClientModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() username: string | null = null;

  @Input() privateKey: string | null = null;

  isCollapsed = false;

  dropdownOpen: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  private_key: string = '';

  public_key: string = '';

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

  regenerarLlaves(): void {
    console.log("Regenerando llaves...");
    // REGENERAR LLAVES AQUI
    let pair = Forge.pki.rsa.generateKeyPair(2048, 0x10001);
    let pemPrivateKey = Forge.pki.privateKeyToPem(pair.privateKey);
    let pemPublicKey = Forge.pki.publicKeyToPem(pair.publicKey);
    let publicKeyStr = pemPublicKey.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\n/g, '');
    let privateKeyStr = pemPrivateKey.replace('-----BEGIN RSA PRIVATE KEY-----', '').replace('-----END RSA PRIVATE KEY-----', '').replace(/\n/g, '');
    this.private_key = privateKeyStr.replace(/\r/g, '');
    this.public_key = publicKeyStr.replace(/\r/g, '');

    console.log('this.llave:::: ', this.public_key);

    const body = { key: this.public_key};

    const apiUrl = 'http://localhost:3000/users/' + this.username + '/key';

    this.http.put(apiUrl, body)
      .subscribe(response => {
          console.log('Llave pública actualizada con éxito', response);
        },
        error => {
          console.error('Error al actualizar la llave pública', error);
        }
      );

    const blob = new Blob([this.private_key], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'private_key.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

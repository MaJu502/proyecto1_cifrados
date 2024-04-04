import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  setPrivateKey(key: string): void {
    localStorage.setItem('privateKey', key);
  }

  getPrivateKey(): string | null {
    return localStorage.getItem('privateKey');
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _username: string = '';

  constructor() { }

  set username(name: string) {
    this._username = name;
  }

  get username(): string {
    return this._username;
  }
}

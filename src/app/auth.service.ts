import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  private credentials:string;

  constructor() {
  }

  public setCredentials(user):void {
    // concatenate username and password and Base64 encode it
    this.credentials = btoa(user.username + ':' + user.password);
  }

  public getCredentials():string {
    return this.credentials;
  }

  public clearCredentials():void {
    this.credentials = null;
  }

}

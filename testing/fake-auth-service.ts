import { Injectable } from "@angular/core";

@Injectable()
export class FakeAuthService {

  private credentials:string = 'YWxleGFuZGVyOlRlc3QxMjM0';

  constructor() {
  }

  public setCredentials(user):void {
  }

  public getCredentials():string {
    return this.credentials;
  }

}

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class SessionService {

  private sessionUrl = 'api/session';

  constructor(private http:Http) {
    console.info('session service instantiated');
  }

  public getSession(serverId: string):Observable<any>{
    // if a server id is set we add it to the query
    if(serverId != '') this.sessionUrl += '?serverId' + serverId;

    // get session from API
    return this.http.get(this.sessionUrl)
      .map(res => res.json() || {});
  }

}

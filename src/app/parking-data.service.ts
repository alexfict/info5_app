import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class ParkingDataService {

  private cityUrl:string = "api/city";
  private centralLocationUrl:string = "api/centralLocation";

  constructor(private http:Http) {
  }

  public getCentralLocation(zoomLevel:number, custerId:number):Observable<any> {
    return this.http.get(this.centralLocationUrl)
      .map(res => res.json() || {})
      .catch(err => Observable.throw(err.toString()));
  }

  public getCluster(zoomLevel:number, gps:Object):Observable<any> {
    return this.http.get(this.cityUrl)
      .map(res => res.json() || {})
      .catch(err => Observable.throw(err.toString()));
  }

}

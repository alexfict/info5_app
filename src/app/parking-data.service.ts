import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { environment } from './../environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class ParkingDataService {

  private serverId:string = "";
  private cityUrl:string = "api/city";
  private centralLocationUrl:string = "api/city";

  constructor(private http:Http) {
  }

  public setServerId(id):void {
    this.serverId = id;
  }

  public getServerId():string {
    return this.serverId;
  }

  public getCentralLocation():Observable<any> {
    console.info(environment.baseUrl + this.serverId);
    return this.http.get(this.centralLocationUrl)
      //return this.http.get(environment.baseUrl + this.serverId)
      .map(res => res.json() || {})
      .catch(err => Observable.throw(err.toString()));
  }

  // TODO: most likely deprecated
  public getCluster(zoomLevel:number, gps:Object):Observable<any> {
    return this.http.get(this.cityUrl)
      .map(res => res.json() || {})
      .catch(err => Observable.throw(err.toString()));
  }

  public zoomLevelConverter(zoomLevel) {
    let convertedZoomLevel:number;

    switch (zoomLevel) {
      case 3:
        convertedZoomLevel = 14;
        break;
      case 2:
        convertedZoomLevel = 16;
        break;
      default:
        convertedZoomLevel = 14;
    }

    return convertedZoomLevel;
  }

}

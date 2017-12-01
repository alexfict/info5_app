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

  public setServerId(id:string):void {
    this.serverId = id.toLowerCase();
  }

  public getServerId():string {
    return this.serverId;
  }

  public getCentralLocation():Observable<any> {
    return this.http.get(environment.baseUrl + this.serverId)
      .map(res => res.json() || {})
      .catch(err => Observable.throw(err.toString()));
  }

  // TODO: most likely deprecated
  public getCluster(lat:number, lng:number, zoomLevel:number):Observable<any> {
    let data = {
      coordinate_x: lat,
      coordinate_y: lng,
      zoomLevel: zoomLevel
    };

    let json_data:string;
    json_data = JSON.stringify(data);

    // set header
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(environment.baseUrl + this.serverId + '/' + zoomLevel, json_data, options)
      .map(res => res.json() || {})
      .catch(err => Observable.throw(err.toString()));
  }

  public getParkingElements(facilityId: number) {
    // TODO replace aachen with this.serverId
    return this.http.get(environment.baseUrl + 'aachen' + '/parking/element?id=' + facilityId)
      .map(res => res.json() || {})
      .catch(err => Observable.throw(err.toString()));
  }

  public getParkingAreas(lat:number, lng:number):Observable<any> {
    let data = {
      coordinate_x: lat,
      coordinate_y: lng
    };

    let json_data:string;
    json_data = JSON.stringify(data);

    // set header
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(environment.baseUrl + this.serverId + '/parking', json_data, options)
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
        convertedZoomLevel = 15;
        break;
      case 1:
        convertedZoomLevel = 16;
        break;
      default:
        convertedZoomLevel = 14;
    }

    return convertedZoomLevel;
  }

}

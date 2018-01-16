import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { environment } from './../environments/environment';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class ParkingDataService {

  private serverId:string = "";
  private cityUrl:string = "api/city";
  private centralLocationUrl:string = "api/city";

  constructor(private http:Http,
              private router:Router) {
  }

  public setServerId(id:string):void {
    this.serverId = id;
  }

  public getServerId():string {
    return this.serverId;
  }

  public getAvailableCities():Observable<any> {
    return this.http.get(environment.baseUrl + 'session')
      .map(res => {
        let data = res.json() || {};
        let cityList:any[] = [];

        // extract names of available cities from response
        data.map(item => cityList.push({name:item.name, serverId:item.secure?'secure/' + item.name :'open/' + item.name}));

        return cityList;
      })
      .catch(err => Observable.throw(err.toString()));
  }

  public getCentralLocation():Observable<any> {
    return this.http.get(environment.baseUrl + this.serverId)
      .map(res => res.json() || {})
      .catch(err => {
        if(err.status == 401) this.router.navigate(['signin']);
        return Observable.throw(err.toString());
      });
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

  public getParkingElements(facilityId:number) {
    return this.http.get(environment.baseUrl + this.serverId + '/parking/element?id=' + facilityId)
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
      case 4:
        convertedZoomLevel = 12;
        break;
      case 3:
        convertedZoomLevel = 13;
        break;
      case 2:
        convertedZoomLevel = 14;
        break;
      case 1:
        convertedZoomLevel = 15;
        break;
      default:
        convertedZoomLevel = 11;
    }

    return convertedZoomLevel;
  }

}

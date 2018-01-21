import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class FakeParkingDataService {

  private serverId:string;

  public setServerId(id:string):void {
    this.serverId = id;
  }

  public getServerId():string {
    return this.serverId;
  }

  public getAvailableCities():Observable<any> {
    // dummy list of cities; represent serverIds
    let cities:any[] = [{name:'aachen', serverId:'open/aachen'}, {name:'cologne',serverId:'open/cologne'}];

    // return an observable with a delay of 2000 to simulate network transmission
    return new Observable (observer => {
      setTimeout(() => {
        observer.next(cities);
        observer.complete();
      }, 2000);
    })
  }

}

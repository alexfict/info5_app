import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ParkingDataService } from '../parking-data.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Router } from '@angular/router';

@Injectable()
export class SessionResolver implements Resolve<any> {

  constructor(private parkingDataService:ParkingDataService,
              private router:Router) {
  }

  resolve(route:ActivatedRouteSnapshot):Observable<any> {
    // check if baseUrl is already set in the parking data service
    let serverId = this.parkingDataService.getServerId();

    if (serverId == '') {
      // try to load server ID from local storage
      serverId = localStorage.getItem('serverId');
      if (!serverId || serverId == '') {
        // redirect to home if it is not stored
        this.router.navigate(['home']);
      } else {
        // set server ID in app and resolve promise
        this.parkingDataService.setServerId(serverId);
        return Observable.of(true);
      }
    } else {
      return Observable.of(true);
    }
  }
}

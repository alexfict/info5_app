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
    let baseUrl = this.parkingDataService.getServerId();

    if (baseUrl == '') {
      // TODO: try to fetch from local storage; if that fails as well than redirect to home
      this.router.navigate(['home']);
    } else {
      return Observable.of(true);
    }
  }
}

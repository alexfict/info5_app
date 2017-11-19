import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {

  constructor() {
  }

  createDb() {
    const city = {
      districts: [
        // north west Aachen
        {
          free: 5,
          total: 10,
          gps: [50.7792, 6.0779]
          ,
          width: 1,
          height: 2,
        },// cluster end
        {
          free: 5,
          total: 10,
          gps: [50.7781, 6.0912]
          ,
          width: 1,
          height: 2,
        }// cluster end
      ], //list of district clusters end
      zoomLevel: 14
    };

    const centralLocation = {
      gps: [50.775, 6.084],
      zoomLevel: 14
    };

    const session = {
      //serverId: 'Aachen'
    };

    return {city, centralLocation, session};
  }

}

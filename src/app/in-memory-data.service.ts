import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {

  constructor() {}

  createDb() {
    const city = {
      districts: [
        {
          free: 5,
          total: 10,
          GPS: {
            lat: 50.3,
            lng: 6.9
          },
          width: 1,
          height: 2,
        }// cluster end
      ], //list of district clusters end
      zoomLevel: 1
    };

    const centralLocation = {
      gps: {
        lat: 50.2,
        lng: 6.8
      },
      zoomLevel: 2
    }

    return {city, centralLocation};
  }

}

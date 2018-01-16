import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class FakePoiService {

  public getPois():Observable<any> {
    // dummy list of pois
    let pois:any[] = [
      {
        "type": "Feature",
        "properties": {
          "@id": "node/282828304",
          "amenity": "pub",
          "name": "Gaffel-Kölsch am Hansemann",
          "opening_hours": "Mo-Sa 11:00-01:00",
          "smoking": "yes"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            6.0936964,
            50.7784727
          ]
        },
        "id": "node/282828304"
      },
      {
        "type": "Feature",
        "properties": {
          "@id": "node/283147294",
          "amenity": "restaurant",
          "cuisine": "greek",
          "name": "Taverne-Grill Alexander"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            6.0936289,
            50.778458
          ]
        },
        "id": "node/283147294"
      }
    ];

    // return list of dummy pois as observable
    return new Observable(observer => {
      observer.next(pois);
      observer.complete();
    });
  }

}

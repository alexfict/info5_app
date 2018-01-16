import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { environment } from './../environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class PoiService {

  private poiPath:string = 'assets/geodata/pois.geojson';

  constructor(private http:Http) {
  }

  public getPois():Observable<any> {
    return this.http.get(this.poiPath)
      .map(res => {
        // parse response as json
        let json_res = res.json() || {};

        // extract list of features from response
        let features = json_res.features;

        // filter out features that do not have a name property
        features = features.filter(feature => {
          return feature.properties.hasOwnProperty('name');
        });

        return features;
      })
      .catch(err => Observable.throw(err.toString()));
  }

}

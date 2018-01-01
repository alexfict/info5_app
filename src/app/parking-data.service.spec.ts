import { async, inject, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ParkingDataService } from './parking-data.service';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

describe('ParkingDataService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
          HttpModule
        ],
        providers: [
          ParkingDataService
        ]
      })
      .compileComponents();
  });

  it('should be injectable', inject([ParkingDataService], (service: ParkingDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should set and get the server id (city name)', inject([ParkingDataService], (service: ParkingDataService) => {
    let dummyServerId = 'aachen';
    service.setServerId(dummyServerId);
    expect(service.getServerId()).toEqual(dummyServerId);
  }));

  it('should fetch a list of available cities/servers', async(inject([ParkingDataService], (service: ParkingDataService) => {
    service.getAvailableCities().subscribe(
      cities => {
        console.info(cities);
        expect(typeof cities).toEqual('array');
      }, err => expect(err).toBeNull()
    );
  })));

});

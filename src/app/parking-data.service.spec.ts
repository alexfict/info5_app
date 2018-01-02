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

  it('should be injectable', inject([ParkingDataService], (service:ParkingDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should set and get the server id (city name)', inject([ParkingDataService], (service:ParkingDataService) => {
    let dummyServerId = 'aachen';
    service.setServerId(dummyServerId);
    expect(service.getServerId()).toEqual(dummyServerId);
  }));

  it('should fetch a list of available cities/servers', async(inject([ParkingDataService], (service:ParkingDataService) => {
    service.getAvailableCities().subscribe(
      cities => {
        console.info(cities);
        expect(typeof cities).toEqual('array');
        //}, err => expect(err).toBeNull()
      }, err => expect(typeof err).toEqual('string')
    );
  })));

  it('should fetch the central location of a predefined city', async(inject([ParkingDataService], (service:ParkingDataService) => {
    // set dummy server ID
    let dummyServerId = 'aachen';
    service.setServerId(dummyServerId);

    service.getCentralLocation().subscribe(
      res => {
        expect(typeof res).toEqual('array');
        //}, err => expect(typeof err).toBeNull()
      }, err => expect(typeof err).toEqual('string')
    );
  })));

  it('should fetch cluster by a given zoom level and geolocation', async(inject([ParkingDataService], (service:ParkingDataService) => {
    // set dummy data
    let lat:number = 50.345;
    let lng:number = 6.423;
    let zoomLevel:number = 2;
    let dummyServerId = 'aachen';

    service.setServerId(dummyServerId);

    service.getCluster(lat, lng, zoomLevel).subscribe(
      res => {
        expect(typeof res).toEqual('array');
        //}, err => expect(typeof err).toBeNull()
      }, err => expect(typeof err).toEqual('string')
    );
  })));

  it('should fetch parking elements of a certain parking location', async(inject([ParkingDataService], (service:ParkingDataService) => {
    // set dummy data
    let lat:number = 50.345;
    let lng:number = 6.423;
    let dummyServerId = 'aachen';

    service.setServerId(dummyServerId);

    service.getParkingAreas(lat, lng).subscribe(
      res => {
        expect(typeof res).toEqual('array');
        //}, err => expect(typeof err).toBeNull()
      }, err => expect(typeof err).toEqual('string')
    );
  })));

  it('should fetch parking elements of a certain parking location', async(inject([ParkingDataService], (service:ParkingDataService) => {
    // set dummy data
    let lat:number = 50.345;
    let lng:number = 6.423;
    let dummyServerId = 'aachen';

    service.setServerId(dummyServerId);

    service.getParkingAreas(lat, lng).subscribe(
      res => {
        expect(typeof res).toEqual('array');
        //}, err => expect(typeof err).toBeNull()
      }, err => expect(typeof err).toEqual('string')
    );
  })));

  it('should convert s o nah zoom levels into leaflet zoom levels', inject([ParkingDataService], (service:ParkingDataService) => {
    // set dummy zoom level
    let zoomLevel:number;
    let convertedZoomLevel:number;

    zoomLevel = 1;
    convertedZoomLevel = service.zoomLevelConverter(zoomLevel);
    expect(convertedZoomLevel).toEqual(15);

    zoomLevel = 2;
    convertedZoomLevel = service.zoomLevelConverter(zoomLevel);
    expect(convertedZoomLevel).toEqual(14);

    zoomLevel = 3;
    convertedZoomLevel = service.zoomLevelConverter(zoomLevel);
    expect(convertedZoomLevel).toEqual(13);

    // test default behaviour
    zoomLevel = 6;
    convertedZoomLevel = service.zoomLevelConverter(zoomLevel);
    expect(convertedZoomLevel).toEqual(13);
  }));
});

import { Injectable } from '@angular/core';

@Injectable()
export class DataExchangeService {

  private parkingLocation;

  constructor() {
  }

  public setParkingLocation(parkingLocation):void {
    this.parkingLocation = parkingLocation;
  }

  public getParkingLocation():any {
    return this.parkingLocation;
  }
}

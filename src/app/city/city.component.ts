import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';

import { latLng, LatLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  public centralLocation:Object;
  public zoomLevel:number;
  public districts:Object[];

  public options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    zoomControl: false,
    zoom: 13,
    center: latLng(50.775, 6.084)
  };

  constructor(private parkingDataService:ParkingDataService) {
  }

  ngOnInit() {
    // returns the central position of the city view (minimum zoom level)
    this.parkingDataService.getCentralLocation(-1, -1)
      .subscribe(suc => {
        // set gps and zoomLevel for the next request
        this.centralLocation = suc.gps || {};
        this.zoomLevel = suc.zoomLevel || -1;

        // returns the districts of the city
        // takes the previously received gps and zoomLevel as arguments
        this.parkingDataService.getCluster(this.zoomLevel, this.centralLocation)
          .subscribe(suc => this.districts = suc.districts,
            err => console.error(err));
      }, err => console.error(err));
  }

}

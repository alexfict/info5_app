import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';

import { latLng, LatLng, tileLayer, rectangle, marker, Map, icon, Layer } from 'leaflet';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  public centralLocation:LatLng;
  public zoomLevel:number;
  public districts;

  /** leaflet options object */
  public options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false
  };

  /** rectangles on the map representing districts, etc. */
  public rectangles:Layer[] = [];

  constructor(private parkingDataService:ParkingDataService) {
  }

  ngOnInit() {

    // returns the central position of the city view (minimum zoom level)
    this.parkingDataService.getCentralLocation(-1, -1)
      .subscribe(suc => {
        // update the view (new central location and zoom level)
        this.centralLocation = suc.gps;
        this.zoomLevel = suc.zoomLevel;

        // returns the districts of the city
        // takes the previously received gps and zoomLevel as arguments
        this.parkingDataService.getCluster(this.zoomLevel, this.centralLocation)
          .subscribe(suc => {
            // set districts
            this.districts = suc.districts;

            // draw districts on the map
            this.districts.map(district => {
              this.rectangles.push(this.calculateRectangle(district.gps, 1000, 45));
            });
          }, err => console.error(err));
      }, err => console.error(err));

  }

  onMapReady(map:Map) {
    // Do stuff with map
  }

  /**
   *
   * @param initPosition: central position of the square we want to draw
   * @param distance: between the center and the upper right corner
   * @param angle
   * @returns leaflet Layer object
     */
  private calculateRectangle(initPosition:number[], distance:number, angle:number):Layer {

    /** calculate start position of the square
     half of the distance in the south west of the central point */
    let startPosition:number[] = [
      initPosition[0] + ((-distance / 2 * Math.cos(angle)) / 0.7871 * 0.00001),
      initPosition[1] + ((-distance / 2 * Math.sin(angle)) / 0.7871 * 0.00001)
    ];

    /** calculate new position of the square
     new position is located in north east of the start position */
    let newPosition:number[] = [
      startPosition[0] + ((distance * Math.cos(angle)) / 0.7871 * 0.00001),
      startPosition[1] + ((distance * Math.sin(angle)) / 0.7871 * 0.00001)
    ];

    return rectangle([startPosition, newPosition]);
  }
}

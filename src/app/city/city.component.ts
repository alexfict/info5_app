import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';

import { latLng, LatLng, tileLayer, rectangle, Map, Layer } from 'leaflet';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  public centralLocation:LatLng;
  public zoomLevel:number;
  public districts:any[];

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
    this.parkingDataService.getCentralLocation()
      .subscribe(data => {

        //// find central coordinate of the map in the response
        //let mapCenter = data.filter(obj => obj.zoomLevel == 3).pop(); // TODO: replace hard coded zoomLevel here
        //
        //// update the view (new central location and zoom level)
        //this.centralLocation = new LatLng(mapCenter.coordinate_x, mapCenter.coordinate_y);
        //
        //// convert zoom level so it fits leaflet map
        //this.zoomLevel = this.parkingDataService.zoomLevelConverter(mapCenter.zoomLevel);
        //
        //// add districts to the view
        //this.districts = data.filter(obj => obj.zoomLevel == 2); // TODO: replace hard coded zoomLevel her
        //
        //this.districts.map(district => {
        //  let pos = [parseFloat(district.coordinate_x), parseFloat(district.coordinate_y)];
        //  this.rectangles.push(this.calculateRectangle(pos, 1000, 45, district.zoomLevel)); // TODO: replace hard coded distance and zoom level here
        //});

        this.updateView(data);
      }, err => console.error(err)); // TODO: what if the server does not respond?

  }

  onMapReady(map:Map) {
    // Do stuff with map
  }

  /**
   *
   * @param initPosition: central position of the square we want to draw
   * @param distance: between the center and the upper right corner
   * @param target angle between the two points
   * @returns leaflet Layer object
   */
  private calculateRectangle(initPosition:number[], distance:number, angle:number, zoomLevel:number):Layer {

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

    return rectangle([startPosition, newPosition]).on('click', (e) => {
      // register on click event
      this.parkingDataService.getCluster(initPosition[0], initPosition[1], zoomLevel)
        .subscribe(data => {
          console.info(data);
          this.updateView(data);
        }, err => console.error(err));

    })
  }

  private updateView(data){
    // find central coordinate of the map in the response
    let mapCenter = data.filter(obj => obj.zoomLevel == 3).pop(); // TODO: replace hard coded zoomLevel here

    // update the view (new central location and zoom level)
    this.centralLocation = new LatLng(mapCenter.coordinate_x, mapCenter.coordinate_y);

    // convert zoom level so it fits leaflet map
    this.zoomLevel = this.parkingDataService.zoomLevelConverter(mapCenter.zoomLevel);

    // add districts to the view
    this.districts = data.filter(obj => obj.zoomLevel == 2); // TODO: replace hard coded zoomLevel her

    this.districts.map(district => {
      let pos = [parseFloat(district.coordinate_x), parseFloat(district.coordinate_y)];
      this.rectangles.push(this.calculateRectangle(pos, 1000, 45, district.zoomLevel)); // TODO: replace hard coded distance and zoom level here
    });
  }
}

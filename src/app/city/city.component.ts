import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';

import { latLng, LatLng, tileLayer, rectangle, Map, Layer, icon, marker, divIcon } from 'leaflet';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  // center of the map
  public centralLocation:LatLng;

  // leaflet zoom level on the map
  public zoomLevel:number;

  // internal zoom level defined by the api to differentiate the views
  // TODO: I want to retrieve this value from the API
  private apiZoomLevel:number = 3;

  // initial values of a square representing a cluster
  private square = {
    pos: [], // center of the cluster
    distance: 1000, // distance between the bottom left and top right point
    angle: 45 // angle of the distance vector relatively to the abscissa
  };

  // leaflet options object
  public options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') // defines the style of the map
    ],
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false
  };

  // layers on the map representing clusters, parking areas etc.
  public layers:Layer[] = [];

  constructor(private parkingDataService:ParkingDataService) {
  }

  ngOnInit() {
    this.loadInitialMapView();
  }

  // TODO: maybe useful later
  onMapReady(map:Map) {
    // Do stuff with map
    //map.on('zoomend', ()=> console.info('zoom end'));
  }

  private loadInitialMapView():void {
    // reset api zoom level and measurements of squares
    this.resetView();

    /** returns the central position of the city view (minimum zoom level)
     *  as well as the highest level of clusters */
    this.parkingDataService.getCentralLocation()
      .subscribe(data => {
        this.updateClusterView(data);
      }, err => console.error(err)); // TODO: what if the server does not respond?
  }


  /**
   *
   * @param initPosition: central position of the square we want to draw
   * @param distance: between the center and the upper right corner
   * @param angle: angle between the two points
   * @param zoomLevel: zoom level of the district
   * @returns leaflet Layer object
   */
  private calculateRectangle(initPosition:number[], distance:number, angle:number, zoomLevel:number):Layer {

    /** calculate start position of the square
     *  half of the distance in the south west of the central point */
    let startPosition:number[] = [
      initPosition[0] + ((-distance / 2 * Math.cos(angle)) / 0.7871 * 0.00001),
      initPosition[1] + ((-distance / 2 * Math.sin(angle)) / 0.7871 * 0.00001)
    ];

    /** calculate new position of the square
     *  new position is located in north east of the start position */
    let newPosition:number[] = [
      startPosition[0] + ((distance * Math.cos(angle)) / 0.7871 * 0.00001),
      startPosition[1] + ((distance * Math.sin(angle)) / 0.7871 * 0.00001)
    ];

    // set color of the rectangle according to occupancy of the district
    let options = {
      color: this.deriveRectangleColor(3, 12) // TODO: get values from API
    };

    // set text input for rectancle according to #freeSlots
    let rectangleLabel = divIcon({
      html: '12', // TODO: get value from API
      className: 'rectangle-label'
    });

    // write the number of free parking slots into the rectangle
    this.layers.push(marker([initPosition[0], initPosition[1]], {icon: rectangleLabel}));

    return rectangle([startPosition, newPosition], options).on('click', (e) => {
      /** if it is the lowest level of cluster view we add markers representing
       *  the parking areas to the map */
      if (this.apiZoomLevel < 2) {
        this.parkingDataService.getParkingAreas(initPosition[0], initPosition[1])
          .subscribe(data => this.updateMarkerView(data, initPosition),
            err => console.error(err));
      }

      /** otherwise we add a collection of squares representing clusters to the map */
      else {
        this.parkingDataService.getCluster(initPosition[0], initPosition[1], zoomLevel)
          .subscribe(data => this.updateClusterView(data),
            err => console.error(err));
      }
    })
  }

  private deriveRectangleColor(freeSpots, totalSpots):string {
    let fractionOfFreeSpots = freeSpots / totalSpots;

    if (fractionOfFreeSpots >= 0.7) return 'green';
    if (fractionOfFreeSpots >= 0.4) return 'yellow';
    if (fractionOfFreeSpots < 0.4) return 'red';
  }

  private calculateMarkers(data):Layer {
    let parkingArea = data;

    let markerOptions = {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 0],
        iconUrl: 'assets/marker-icon.png'
      })
    };

    return marker([parkingArea.gps.coordinate_x, parkingArea.gps.coordinate_y], markerOptions);
  }


  private updateMarkerView(data, center:number[]):void {
    let parkingAreas = data;

    // update center of the map
    this.centralLocation = new LatLng(center[0], center[1]);

    // update zoom level of the map
    this.zoomLevel = this.parkingDataService.zoomLevelConverter(this.apiZoomLevel);

    // clear layers list
    this.layers = [];

    // add markers (parking areas) to the layers list
    parkingAreas.map(parkingArea => this.layers.push(this.calculateMarkers(parkingArea)));
  }

  private updateClusterView(data) {

    // find central coordinate of the map in the response
    let mapCenter = data.filter(obj => obj.zoomLevel == this.apiZoomLevel).pop(); // TODO: replace hard coded zoomLevel here

    // update the view (new central location and zoom level)
    this.centralLocation = new LatLng(mapCenter.coordinate_x, mapCenter.coordinate_y);

    // convert zoom level so it fits leaflet map
    this.zoomLevel = this.parkingDataService.zoomLevelConverter(this.apiZoomLevel);

    // add districts to the view
    let districts = data.filter(obj => obj.zoomLevel == this.apiZoomLevel - 1); // TODO: replace hard coded zoomLevel her

    // clear list of layers
    this.layers = [];

    // add new layers to the map
    districts.map(district => {
      this.square.pos = [parseFloat(district.coordinate_x), parseFloat(district.coordinate_y)];
      this.layers.push(this.calculateRectangle(this.square.pos, this.square.distance, this.square.angle, district.zoomLevel)); // TODO: replace hard coded distance and zoom level here
    });

    // keep track of the internal zoom level (API) and adjust the size of the squares
    if (this.apiZoomLevel > 0) {
      this.apiZoomLevel--;
      this.square.distance = this.square.distance / 2;
    }
  }

  public zoomOut(event):void {
    // TODO: for now, always jump back to the highest zoom level
    // in the future we would like to go stepwise back
    this.loadInitialMapView();
  }

  private resetView():void {
    this.apiZoomLevel = 3;
    this.square.distance = 1000;
  }

  public zoomToUserPos() {
    this.layers.push(marker([50,6],{id:1}));
    let foo = this.layers.filter(layer => layer.options.id == 1);
    console.info(foo);
    let self = this;
    let geoId = navigator.geolocation.getCurrentPosition(function (pos) {
      self.centralLocation = new LatLng(pos.coords.latitude, pos.coords.longitude);
      self.apiZoomLevel = 1;
      self.zoomLevel = self.parkingDataService.zoomLevelConverter(self.apiZoomLevel);
    }, function (err) {
      console.error(err);
      alert('Bitte schalten Sie Ihr GPS ein');
    });
  }
}

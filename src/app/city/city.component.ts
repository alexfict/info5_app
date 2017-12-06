import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';
import { Router } from '@angular/router';

import { latLng, LatLng, tileLayer, rectangle, Map, Layer, icon, marker, divIcon } from 'leaflet';
import {Cluster} from "../cluster.class";

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
  // TODO: In future retrieve this value from the API
  private apiZoomLevel:number = 3;

  // initDist on the highest zoom level
  private initDist:number = 1000;

  // highest zoom level
  private initZoomLevel:number = 3;

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

  constructor(private parkingDataService:ParkingDataService,
              private router:Router) {
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

    /**
     * @returns object: central position of the city view plus the highest level of clusters
     */
    this.parkingDataService.getCentralLocation()
      .subscribe(data => {
        if (Object.keys(data).length === 0 || !data) {
          this.router.navigate(['home']);
        } else {
          this.updateClusterView(data);
        }
      }, err => console.error(err)); // TODO: what if the server does not respond?
  }


  /**
   * @param cluster Cluster
   * @returns leaflet Layer object
   */
  private calculateRectangle(cluster:Cluster):Layer {

    /**
     * The API provides the distance from the center to the wedge
     * Leaflet draws rectangles from one corner to the opposite one
     * Thus, it is required to calculate an extra position with the given distance and angle
     */
    let newPosition:number[] = [
      cluster.position.lat + ((cluster.distance * Math.cos(cluster.degree)) / 0.7871 * 0.00001),
      cluster.position.lng + ((cluster.distance * Math.sin(cluster.degree)) / 0.7871 * 0.00001)
    ];

    // set options for the rectangle
    let options = {
      color: cluster.color
    };

    return rectangle([this.centralLocation, newPosition], options).on('click', (e) => {
      /** if it is the lowest level of cluster view we add markers representing
       *  the parking areas to the map */
      if (this.apiZoomLevel == 2) {
        this.parkingDataService.getParkingAreas(cluster.position.lat, cluster.position.lng)
          .subscribe(data => this.updateMarkerView(data, [cluster.position.lat, cluster.position.lng]),
            err => console.error(err));
      }

      /** otherwise we add a collection of squares representing clusters to the map */
      else {
        this.parkingDataService.getCluster(cluster.position.lat, cluster.position.lng, cluster.zoomLevel)
          .subscribe(data => this.updateClusterView(data),
            err => console.error(err));
      }

      // decrease api zoom level
      this.apiZoomLevel--;
    })
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

    return marker([parkingArea.gps.coordinate_x, parkingArea.gps.coordinate_y], markerOptions)
      .on('click', () => this.router.navigate(['parkingelements', parkingArea.id]));
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

    // find central coordinate of the map in the parameter
    let mapCenter = data.filter(obj => obj.coordinate.zoomLevel == this.apiZoomLevel).pop();

    // update the view (new central location and zoom level)
    this.centralLocation = new LatLng(mapCenter.coordinate.coordinate_x, mapCenter.coordinate.coordinate_y);

    // convert zoom level so it fits leaflet map
    this.zoomLevel = this.parkingDataService.zoomLevelConverter(this.apiZoomLevel);

    // clear list of layers
    this.layers = [];

    // add districts to the view
    let districts = data.filter(obj => obj.coordinate.zoomLevel == this.apiZoomLevel - 1);

    districts.map(district => {
      let cluster = new Cluster(
        [district.coordinate.coordinate_x, district.coordinate.coordinate_y],
        district.coordinate.distanceFromCenter,
        district.coordinate.zoomLevel,
        district.coordinate.degree,
        district.availableParking,
        district.totalParking
      );
      this.layers.push(this.calculateRectangle(cluster))
    });

    //TODO: remove; dev only; visualize center of cluster on map
    districts.map(district => {
      let markerOptions = {
        icon: icon({
          iconSize: [10, 10],
          //iconAnchor: [13, 0],
          iconUrl: 'assets/marker-icon.png'
        })
      };
      this.layers.push(marker([district.coordinate.coordinate_x, district.coordinate.coordinate_y], markerOptions));
    });
  }

  public zoomOut(event):void {
    // TODO: for now, always jump back to the highest zoom level
    // in the future we would like to go stepwise back
    this.loadInitialMapView();
  }

  private resetView():void {
    this.apiZoomLevel = this.initZoomLevel;
  }

  public zoomToUserPos() {
    let self = this;

    navigator.geolocation.getCurrentPosition(function (pos) {
      // fetch parking areas nearby user's position
      self.parkingDataService.getParkingAreas(pos.coords.latitude, pos.coords.longitude)
        .subscribe(data => self.updateMarkerView(data, [pos.coords.latitude, pos.coords.longitude]),
          err => console.error(err));
    }, function (err) {
      console.error(err);
      alert('Please enable GPS');
    });
  }
}

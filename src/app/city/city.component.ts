import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { AuthService } from '../auth.service';

import { latLng, LatLng, tileLayer, rectangle, Map, Layer, icon, marker, divIcon, Control, control } from 'leaflet';
import { Cluster } from "../cluster.class";

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
  private apiZoomLevel:number;

  // highest zoom level
  private initZoomLevel:number;

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

  // hide the search on init
  public displaySearchBar:string = 'hidden';

  constructor(private parkingDataService:ParkingDataService,
              private router:Router,
              private iconRegistry:MatIconRegistry,
              private sanitizer:DomSanitizer,
              private authService:AuthService) {
    iconRegistry.addSvgIcon('zoom-out', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_zoom_out_map.svg'));
    iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_black.svg'));
    iconRegistry.addSvgIcon('my-location', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_my_location.svg'));
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_search.svg'));
  }

  ngOnInit() {
    this.loadInitialMapView();
  }

  // TODO: maybe useful later
  onMapReady(map:Map) {
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
          // highest available zoom level for this very city
          let highestZoomlevel = data[0].coordinate.zoomLevel;
          this.initZoomLevel = highestZoomlevel;
          this.apiZoomLevel = highestZoomlevel;
          this.updateClusterView(data);
        }
      }, err => {
        console.error(err);
      }); // TODO: what if the server does not respond?
  }


  /**
   * @param cluster Cluster
   * @returns leaflet Layer object
   */
  private calculateRectangle(cluster:Cluster):Layer {

    let measurement1:number = 1.1119492664455889 / 0.00001; // At 6.083496 E
    let measurement2:number = 0.703179604179696 / 0.00001; // At 50.773369 N

    // Necessary to calculate the geo point of the top right corner of the square
    let radian = cluster.degree * Math.PI / 180;

    let newPosition:number[] = [
      cluster.position.lat + (cluster.distance * Math.cos(radian) / measurement1),
      cluster.position.lng + (cluster.distance * Math.sin(radian) / measurement2)
    ];

    // set options for the rectangle
    let options = {
      color: cluster.color
    };

    //return rectangle([startPosition, newPosition], options);
    return rectangle([this.centralLocation, newPosition], options);
  }

  private calculateMarkers(data):Layer {
    let parkingArea = data;
    let iconColor:string;

    // calculate fraction of free spots
    let fractionOfFreeSpots = parkingArea.availableParking / parkingArea.totalParking;

    if (fractionOfFreeSpots >= 0.7) {
      iconColor = 'green';
    } else if (fractionOfFreeSpots >= 0.4) {
      iconColor = 'yellow';
    } else {
      iconColor = 'red';
    }

    let markerOptions = {
      icon: icon({
        iconSize: [39.4, 58],
        iconAnchor: [19, 29],
        iconUrl: 'assets/icons/pin_' + iconColor + '.png'
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

      let onClusterClick = (e) => {
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
      }

      this.layers.push(this.calculateRectangle(cluster)
        .on('click', onClusterClick));
      this.layers.push(marker([district.coordinate.coordinate_x, district.coordinate.coordinate_y], {icon: cluster.label})
        .on('click', onClusterClick));
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

    this.apiZoomLevel = 1;

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

  /**
   * zooms to a location and displays parking areas nearby
   * @param location the client wants to get nearby parking areas of
   */
  public zoomToLocation(location) {
    // hide search bar
    this.displaySearchBar = 'hidden';

    // zoom in
    this.apiZoomLevel = 1;

    // fetch parking areas nearby the location
    this.parkingDataService.getParkingAreas(location.geometry.coordinates[1], location.geometry.coordinates[0])
      .subscribe(data => this.updateMarkerView(data, [location.geometry.coordinates[1], location.geometry.coordinates[0]]),
        err => console.error(err));
  }

  public toggleSearchBar() {
    this.displaySearchBar = this.displaySearchBar == 'display' ? 'hidden' : 'display';
  }

  public signOut(){
    this.authService.clearCredentials();
    this.router.navigate(['home']);
  }
}

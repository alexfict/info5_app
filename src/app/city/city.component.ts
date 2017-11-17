import { Component, OnInit } from '@angular/core';
import { ParkingDataService} from '../parking-data.service';


import 'rxjs/add/operator/do';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  private centralLocation:Object;
  private zoomLevel:number;
  private districts:Object[];

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

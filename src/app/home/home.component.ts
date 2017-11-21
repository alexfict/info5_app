import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private parkingDataService:ParkingDataService,
              private route:ActivatedRoute,
              private router:Router) {
  }

  ngOnInit() {
    // fetch serverId from URI
    let serverId = this.route.snapshot.params['serverId'] || '';

    // set serverId
    if (serverId) {
      this.parkingDataService.setServerId(serverId);
      // redirect to the city view
      this.router.navigate(['city']);
    }
  }

  /** triggered by the user via the select box */
  public updateServerId(serverId) {
    console.info('Button clicked, update to ' + serverId);
    this.parkingDataService.setServerId(serverId);
    this.router.navigate(['city']);
  }
}

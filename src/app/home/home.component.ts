import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private session: SessionService) { }

  ngOnInit() {
    // init request to the server getSession([serverId])

    /** case 1: no session set on the server
     *    - load the home view and let the user select a city (server)
     *  case 2: session set on the server
     *    - redirect to city view
     **/
  }

}

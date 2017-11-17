import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private session:SessionService,
              private route:ActivatedRoute,
              private router:Router) {
  }

  ngOnInit() {

    // fetch serverId from URI
    let serverId = this.route.snapshot.params['serverId'] || '';
    console.info('ServerId: ' + serverId);

    // get session from API
    this.session.getSession(serverId)
      .subscribe(suc => {
          console.info(suc);

          // if a session still exists, we directly redirect to the city view
          if (suc.serverId) this.router.navigate(['city']);
        }, err => console.error(err)
      );

    // init request to the server getSession([serverId])

    /** case 1: no session set on the server
     *    - load the home view and let the user select a city (server)
     *  case 2: session set on the server
     *    - redirect to city view
     **/
  }
}

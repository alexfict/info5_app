import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public prevRoute;

  constructor(private router:Router) {
  }

  ngOnInit() {
  }

  @Output() zoomOut = new EventEmitter();

  public emitZoomOutEvent():void {
    this.zoomOut.emit();
  }

}

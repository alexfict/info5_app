import { Directive, HostListener, HostBinding, Input} from '@angular/core';

@Directive({
  selector: '[leaflet]' // this directive is attached to leaflet directive
})
export class MapHostDirective {

  constructor() {
  }

  // offset due to navigation bar on top
  private offset = 40;

  ngOnInit(){
    // set size of the map on load
    this.updateMapSize();
  }

  @HostListener('window:resize') onResize() {
    // update map size when window size changes
    this.updateMapSize();
  }

  // bind variable to leaflet width and height
  @HostBinding('style.width') mapWidth;
  @HostBinding('style.height') mapHeight;

  private updateMapSize(){
    this.mapWidth = window.innerWidth + "px";
    this.mapHeight = window.innerHeight - this.offset + "px";
  }

}

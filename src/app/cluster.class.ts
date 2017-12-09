import { LatLng, divIcon, icon } from 'leaflet';

export class Cluster {

  public position:LatLng; // geo position of center
  public distance:number; // distance from center of district to center of map view
  public zoomLevel:number;
  public degree:number;
  public color:string;    // cluster color based on occupancy
  public label:any;

  public constructor(position:number[], distance:number, zoomLevel:number, degree:number, emptySlots:number, totalSlots:number) {
    this.position = new LatLng(position[0], position[1]);
    this.distance = distance;
    this.zoomLevel = zoomLevel;
    this.degree = degree;
    this.color = this.calculateColor(emptySlots, totalSlots);
    this.label = this.setLabel(emptySlots);
  }

  private calculateColor(emptySlots:number, totalSlots:number):string {
    let fractionOfFreeSpots = emptySlots / totalSlots;

    if (fractionOfFreeSpots >= 0.7) return 'green';
    if (fractionOfFreeSpots >= 0.4) return 'yellow';
    if (fractionOfFreeSpots < 0.4) return 'red';
  }

  private setLabel(emptySlots:number):any {
    return divIcon({
      html: "<i style='font-size:16px;white-space: nowrap;'>" + emptySlots + ' free</i>',
      className: 'rectangle-label',
      iconSize: [0, 0],
      iconAnchor: [20, 20],
    });
  }

}

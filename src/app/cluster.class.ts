import { LatLng } from 'leaflet';

export class Cluster {

  public position:LatLng; // geo position of center
  public distance:number; // distance from center of district to center of map view
  public zoomLevel:number;
  public degree:number;
  public color:string;    // cluster color based on occupancy

  public constructor(position:number[], distance:number, zoomLevel:number, degree:number, emptySlots:number, occupiedSlots:number){
    this.position = new LatLng(position[0], position[1]);
    this.distance = distance;
    this.zoomLevel = zoomLevel;
    this.degree = degree;
    this.color = this.calculateColor(emptySlots, occupiedSlots);
  }

  private calculateColor(emptySlots:number, occupiedSlots:number):string{
    let fractionOfFreeSpots = emptySlots / occupiedSlots;

    if (fractionOfFreeSpots >= 0.7) return 'green';
    if (fractionOfFreeSpots >= 0.4) return 'yellow';
    if (fractionOfFreeSpots < 0.4) return 'red';
  }

}

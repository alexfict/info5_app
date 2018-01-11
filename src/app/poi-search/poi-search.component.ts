import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {PoiService} from "../poi.service";

@Component({
  selector: 'app-poi-search',
  templateUrl: './poi-search.component.html',
  styleUrls: ['./poi-search.component.css'],
  animations: [
    trigger('state', [
      state('hidden', style({
        opacity: '0',
        display: 'none'
      })),
      state('displayed', style({
        opacity: '1',
        display: 'inline-block'
      })),
      transition('hidden => displayed', animate('1s ease-in')), // TODO: not working for some reason
      transition('displayed => hidden', animate(0))
    ])
  ]
})
export class PoiSearchComponent implements OnInit {

  public poiControl:FormControl;
  public filteredPois:Observable<string[]>;
  public pois = [];

  // defines if the search bar is displayed or not
  @Input() state:string;
  // emits the selected location to the client component
  @Output() selectedPoiLocation:EventEmitter = new EventEmitter();

  constructor(private poiService:PoiService) {
    this.poiControl = new FormControl();
  }

  ngOnInit() {
    // filter POIs whenever the search string changes
    this.filteredPois = this.poiControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    // fetch POIs from poi service
    this.poiService.getPois().subscribe(
      pois => {
        this.pois = pois;
      }, err => console.error(err));
  }

  /**
   *
   * @param val search string
   * @returns {any} list of filtered POIs or an empty array if the user just selected a POI
   */
  filter(val:string):string[] {
    if (typeof val == 'string') {
      return this.pois.filter(poi =>
      poi.properties.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    } else {
      return [];
    }
  }

  /**
   * When selecting an option in the auto complete input, Angular will replace the the text input by the entire object.
   * To still display the name of the POI we need to define what to actually display from the object.
   * @param val object selected in the auto complete input field
   * @returns {string} name of the object (poi) currently selected in the auto complete input
   */
  displayPois(val:any) {
    return val ? val.properties.name : val;
  }

  /**
   * Zoom to the selected POI
   * @param event contains the selected POI
   */
  goToPoi(event) {
    this.selectedPoiLocation.emit(event.option.value);
  }
}

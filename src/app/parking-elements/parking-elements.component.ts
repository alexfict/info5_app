import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';
import { ActivatedRoute, Router } from '@angular/router';

// dummy api response data

let data = {
    parkingLevels: [
        {
            level: 1,
            parkingElements: [
                {
                    id: 12,
                    GPS: 'someGPSOBJECT',
                    length: 2,
                    orientation: 'orientation',
                    width: 2,
                    type: 'counter',
                    state: false,
                    free: 10,
                    total: 12
                }, // parking element end
            ] //list of parking elements end
        }, //level end
    ] //list of levels end
}; //data object end


@Component({
    selector: 'app-parking-elements',
    templateUrl: './parking-elements.component.html',
    styleUrls: ['./parking-elements.component.css']
})

export class ParkingElementsComponent implements OnInit {

    constructor(private parkingDataService: ParkingDataService,
                private router:Router) {
    }

    ngOnInit() {
    }

    /**
     * Checks if a parking facility has multiple stores
     * @param parkingData the data returned from the api
     * @returns {boolean}
     */
    public isMultiStore(parkingData):boolean {
        if (parkingData.parkingLevels.length > 1) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * TODO
     * @param data the data provided by the API
     */
    private calibrateCoordinatesToPixels(data) {
        let svgBox = document.getElementById("spotsView");
        let width = svgBox.clientWidth;
        let height = svgBox.clientHeight;
    }

    /**
     *
     * @returns {any}
     */
    public displaySpots() {
        // TODO get facilityId from zoomLevel1

        // TODO use the data from the API call once implemented instead of the hardcoded one
        /*
        this.parkingDataService.getParkingLocation(parkingFacilityId)
            .subscribe(data => // do sth,
                err => console.error(err));
        */
        // instead of x,y use GPS Object from data
        let multiStore = this.isMultiStore(data);

        // dummy data TODO: calibrate the GPS coordinates
        let spots = [
            {lan: 0, lon: 0, width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 1.5, lon: 0, width: 1, height: 3, color: "green", orientation: "rotate(0)", free: null},
            {lan: 3, lon: 0, width: 1, height: 3, color: "green", orientation: "rotate(0)", free: null},
            {lan: 4.5, lon: 0, width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 6, lon: 0, width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 7.5, lon: 0, width: 1, height: 3, color: "green", orientation: "rotate(0)", free: null},
            {lan: 0, lon: 4, width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 1.5, lon: 4, width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 3, lon: 4, width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 4.5, lon: 4, width: 1, height: 3, color: "green", orientation: "rotate(0)", free: null},
            {lan: 6, lon: 4, width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 7.5, lon: 4, width: 1, height: 3, color: "green", orientation: "rotate(0)", free: null},

        ]
        let svgBox = document.getElementById("spotsView");
        console.info(svgBox.clientWidth + ' width of svgbox');
        // if we have a single store facility
        if (!multiStore) {

            return spots
        }
        // multi-store facility
        // returns store view
        else {

            return spots
        }
    }
}

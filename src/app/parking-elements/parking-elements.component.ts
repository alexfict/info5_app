import {Component, OnInit} from '@angular/core';
import {ParkingDataService} from '../parking-data.service';

// dummy data for testing
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

    constructor(private parkingDataService: ParkingDataService) {
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
     *
     * @param data
     * @returns {any}
     */
    public displaySpots(data) {
        // TODO get facilityId from zoomLevel1

        // TODO use the data from the API call once implemented instead of the hardcoded one
        /*
        this.parkingDataService.getParkingLocation(parkingFacilityId)
            .subscribe(data => // do sth,
                err => console.error(err));
        */
        // instead of x,y use GPS Object from data
        let multiStore = this.isMultiStore(data);

        if (!multiStore) {
            let spots = [
                { x: 0, y: 10, width: 20, height: 50, color: "red"},
                { x: 30, y: 10, width: 20, height: 50, color: "green"},
                { x: 60, y: 10, width: 20, height: 50, color: "red"},
            ];

            return spots
        }
        else {
            let spots = [
                { x: 0, y: 10, width: 20, height: 50, color: "red"},
            ];

            return spots
        }
    }
}

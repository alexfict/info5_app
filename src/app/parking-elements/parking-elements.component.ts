import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../parking-data.service';
import { ActivatedRoute, Router } from '@angular/router';

// dummy api response data
var data = {
    parkingLevels: [
        {
            level: 1,
            parkingElements: [
                {
                    id: 12,
                    GPS: {
                        lon: 50.779678,
                        lat: 6.112327
                    },
                    length: 2,
                    orientation: 'orientation',
                    width: 2,
                    type: 'counter',
                    state: true,
                    free: 10,
                    total: 12
                },
                {
                    id: 12,
                    GPS: {
                        lon: 50.779655,
                        lat: 6.112331
                    },
                    length: 2,
                    orientation: 'orientation',
                    width: 2,
                    type: 'counter',
                    state: false,
                    free: 10,
                    total: 12
                },
                {
                    id: 12,
                    GPS: {
                        lon: 50.779596,
                        lat: 6.112330
                    },
                    length: 2,
                    orientation: 'orientation',
                    width: 2,
                    type: 'counter',
                    state: true,
                    free: 10,
                    total: 12
                },
                {
                    id: 12,
                    GPS: {
                        lon: 50.779610,
                        lat: 6.112971
                    },
                    length: 2,
                    orientation: 'orientation',
                    width: 2,
                    type: 'counter',
                    state: false,
                    free: 10,
                    total: 12
                },
                {
                    id: 12,
                    GPS: {
                        lon: 50.779613,
                        lat: 6.113053
                    },
                    length: 2,
                    orientation: 'orientation',
                    width: 2,
                    type: 'counter',
                    state: false,
                    free: 10,
                    total: 12
                }, // parking element end// parking element end// parking element end
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
     * Returns the calibrated proportions between pixels and gps coordinates
     * @param parkingLevel the data for a single parking level provided by the API
     */
    private calibrateCoordinatesToPixels(parkingLevel) {
        // the svg component in which all spots will be displayed
        let svgBox = document.getElementById("spotsView");
        let pixelWidth = svgBox.clientWidth;
        let pixelHeight = svgBox.clientHeight;
        let gpsWidth = this.getGpsWidth(parkingLevel);
        let gpsHeight = this.getGpsHeight(parkingLevel);

        return {calibratedWidth: gpsWidth/pixelWidth, calibratedHeight: gpsHeight/pixelHeight}
    }

    /**
     * Finds the height(latitude) in terms of gps entities
     * @param parkingLevel the current parking level
     * @returns {number}
     */
    private getGpsHeight(parkingLevel) {
        let maxLat = this.getMax(parkingLevel.parkingElements, 'lat');
        let minLat = this.getMin(parkingLevel.parkingElements, 'lat');
        return maxLat - minLat
    }

    /**
     * Finds the height(longitude) in terms of gps entities
     * @param parkingLevel the current parking level
     * @returns {number}
     */
    private getGpsWidth(parkingLevel) {
        let maxLon = this.getMax(parkingLevel.parkingElements, 'lon');
        let minLon = this.getMin(parkingLevel.parkingElements, 'lon');
        return maxLon - minLon
    }

    /**
     * Helper function for finding max of a property in a array of json's
     * @param parkingElements the array
     * @param prop the desired property
     * @returns {number}
     */
    private getMax(parkingElements, prop) {
        var max = 0;
        for (var i=0; i<parkingElements.length; i++) {
            if (parkingElements[i].GPS[prop] > max) {
                max = parkingElements[i].GPS[prop];
            }
        }
        return max;
    }

    /**
     * Helper function for finding min of a property in a array of json's
     * @param parkingElements the array
     * @param prop the desired property
     * @returns {number}
     */
    private getMin(parkingElements, prop) {
        var min = 10000000;
        for (var i=0; i<parkingElements.length; i++) {
            if (parkingElements[i].GPS[prop] < min) {
                min = parkingElements[i].GPS[prop];
            }
        }
        return min;
    }

    /** TODO use hex colors
     * Provides coloring for parking spots according to their status
     * @param isFree true if slot is free, false otherwise
     * @returns the color
     */
    private stateColor(isFree) {
        if (isFree) {
            return 'green'
        }
        else
            return 'red'
    }

    /**
     * gets parking elements data from the API and waits for response
     * @param facilityId the id of the parking facility
     * @returns elements data
     */
    private getParkingElementsData(facilityId) {
        return new Promise((resolve, reject) => {
            this.parkingDataService.getParkingElements(facilityId)
                .subscribe(response => resolve(response),
                    err => reject(err));
        })
    }

    /**
     * Gets the parking spots data from the api and creates svg rect objects for the visualisation
     * @returns rect objects for each spot
     */
    public displaySpots() {
        // TODO Here comes the data from the API. Get the facilityId for that! When available, replace the dummy data array

        this.getParkingElementsData(1).then((parkingElementsData) => {
           console.log(parkingElementsData);
        });

        /* Alternative use this:
        this.parkingDataService.getParkingElements(1)
            .subscribe(response => console.log(response),
                err => console.error(err));
        */

        let multiStore = this.isMultiStore(data);

        // old dummy data
        /*
        let spots = [
            {lan: "0px", lon: "0px", width: 1, height: 3, color: "red", orientation: "rotate(0)", free: null},
            {lan: 20, lon: 40, width: 1, height: 3, color: "green", orientation: "rotate(0)", free: null},
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

        ];*/

        // if we have a single store facility
        if (!multiStore) {
            let output = [];
            let parkingElements = data.parkingLevels[0].parkingElements;
            let minLon = this.getMin(parkingElements, 'lon');
            let maxLat = this.getMax(parkingElements, 'lat');
            let calibratedCoordinates = this.calibrateCoordinatesToPixels(data.parkingLevels[0]);
            let calibratedWidth = calibratedCoordinates.calibratedWidth;
            let calibratedHeight = calibratedCoordinates.calibratedHeight;
            for (var i=0; i<parkingElements.length; i++) {
                let xCoord = (parkingElements[i].GPS.lon - minLon) / calibratedWidth / 100;
                let yCoord = (maxLat - parkingElements[i].GPS.lat) / calibratedHeight / 100;
                let stateColor = this.stateColor(parkingElements[i].state);
                let spotData = {lan: xCoord+'px', lon: yCoord+'px', width: 1, height: 3, color: stateColor, orientation: "rotate(0)", free: null}
                output.push(spotData);
            }
            let coordinates = this.calibrateCoordinatesToPixels(data.parkingLevels[0]);

            return output
        }
        // multi-store facility
        // returns store view
        else {
            return null
        }
    }
}

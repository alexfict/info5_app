import {Component, OnInit} from '@angular/core';
import {ParkingDataService} from '../parking-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {LatLng} from 'leaflet';


// dummy api response data
var data =
    {
        levels: [
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
                private router: Router,
                private iconRegistry: MatIconRegistry,
                public route: ActivatedRoute,
                private sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_black.svg'));
        iconRegistry.addSvgIcon('navigate-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/navigate-icon.svg'));
        iconRegistry.addSvgIcon('navigate-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_directions.svg'));
    }

    public spots: any[];

    // approx location of the parking area
    private parkingAreaLocation: LatLng;

    ngOnInit() {
        // the id of the clicked parking area
        let id = this.route.snapshot.params['id'];

        // fetch parking areas from API
        this.parkingDataService.getParkingElements(id)
            .subscribe(data => {
                // set location of the parking area
                this.parkingAreaLocation = new LatLng(data.levels[0].parkingElements[0].gps.coordinate_x, data.levels[0].parkingElements[0].gps.coordinate_y);
                console.info(this.parkingAreaLocation);

                this.spots = this.displaySpots(data.levels)
            }, err => console.error(err));
    }

    /**
     * Checks if a parking facility has multiple stores
     * @param parkingData the data returned from the api
     * @returns {boolean}
     */
    public isMultiStore(parkingLevels): boolean {
        if (parkingLevels.length > 1) {
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

        return {calibratedWidth: gpsWidth / pixelWidth, calibratedHeight: gpsHeight / pixelHeight}
    }

    /**
     * Finds the height(latitude) in terms of gps entities
     * @param parkingLevel the current parking level
     * @returns {number}
     */
    private getGpsHeight(parkingLevel) {
        let maxLat = this.getMax(parkingLevel.parkingElements, 'coordinate_x');
        let minLat = this.getMin(parkingLevel.parkingElements, 'coordinate_x');
        return maxLat - minLat
    }

    /**
     * Finds the height(longitude) in terms of gps entities
     * @param parkingLevel the current parking level
     * @returns {number}
     */
    private getGpsWidth(parkingLevel) {
        let maxLon = this.getMax(parkingLevel.parkingElements, 'coordinate_y');
        let minLon = this.getMin(parkingLevel.parkingElements, 'coordinate_y');
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
        for (var i = 0; i < parkingElements.length; i++) {
            if (parkingElements[i].gps[prop] > max) {
                max = parkingElements[i].gps[prop];
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
        for (var i = 0; i < parkingElements.length; i++) {
            if (parkingElements[i].gps[prop] < min) {
                min = parkingElements[i].gps[prop];
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

    public navigateToParkingFacility(): void {
        //return 'https://maps.google.com/?saddr=My%20Location&daddr=' + xCoordinate + ',' + yCoordinate;
        window.location.href = "https://maps.google.com/?saddr=My%20Location&daddr=50.779683,6.101926";
        // set geo coordinates for destination
        let destination = this.parkingAreaLocation.lat + ',' + this.parkingAreaLocation.lng;
        // get current location of the user and open navigation in a new window/tab
        navigator.geolocation.getCurrentPosition(function (pos) {
            let userLocation = pos.coords.latitude + ',' + pos.coords.longitude;
            let googleLink = 'https://maps.google.com/?saddr=' + userLocation + '&daddr=' + destination;

            window.open(googleLink);
        });
    }

    public createRow(objects, yValue, incrementXBy, incrementWidthBy, decrementHeightBy) {
        let rowOutput = [];
        for (let i = 0; i < objects.length; i++) {
            objects[i].lan = i * incrementXBy;
            objects[i].lon = yValue;
            objects[i].width += incrementWidthBy;
            objects[i].height -= decrementHeightBy;
            rowOutput.push(objects[i])
        }
        return rowOutput;
    }

    /**
     * Gets the parking spots data from the api and creates svg rect objects for the visualisation
     * @returns rect objects for each spot
     */
    public displaySpots(parkingLevels: any[]) {
        /*
        let multiStore = this.isMultiStore(parkingLevels);
        // if we have a single store facility
        if (!multiStore || multiStore) {

        }
        // multi-store facility
        else {
          return null
        }
        */
        let tempOutput = [];
        let output = [];
        let parkingElements = parkingLevels[0].parkingElements;
        let minLon = this.getMin(parkingElements, 'coordinate_y');
        let maxLat = this.getMax(parkingElements, 'coordinate_x');
        let calibratedCoordinates = this.calibrateCoordinatesToPixels(parkingLevels[0]);
        let calibratedWidth = calibratedCoordinates.calibratedWidth;
        let calibratedHeight = calibratedCoordinates.calibratedHeight;
        for (var i = 0; i < parkingElements.length; i++) {
            let xCoord = (parkingElements[i].gps.coordinate_y - minLon) / calibratedWidth / 35;
            let yCoord = (maxLat - parkingElements[i].gps.coordinate_x) / calibratedHeight / 35;
            let stateColor = this.stateColor(parkingElements[i].state);
            let spotData = {
                lan: xCoord + 'px',
                lon: yCoord + 'px',
                width: 2,
                height: 5,
                color: stateColor,
                orientation: "rotate(0)",
                free: null
            };
            tempOutput.push(spotData);
        }
        let id = this.route.snapshot.params['id'];
        if (id == "1001") {
            output.push(this.createRow(tempOutput.slice(0, 18), 0, 2.2, 0, 0));
            output.push(this.createRow(tempOutput.slice(38, 42), 8.2, 9.9, 7.7, 2.5));
            output.push(this.createRow(tempOutput.slice(42, 46), 10.7, 9.9, 7.7, 2.5));
            output.push(this.createRow(tempOutput.slice(19, 37), 16.4, 2.2, 0, 0));
        }
        else {
            output.push(tempOutput);
        }

        return output
    }
}

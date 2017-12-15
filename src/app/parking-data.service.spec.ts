import { TestBed, inject } from '@angular/core/testing';

import { ParkingDataService } from './parking-data.service';

describe('ParkingDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParkingDataService]
    });
  });

  /*it('should ...', inject([ParkingDataService], (service: ParkingDataService) => {
    expect(service).toBeTruthy();
  }));*/
});

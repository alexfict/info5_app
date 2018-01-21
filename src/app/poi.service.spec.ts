import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response } from '@angular/http';

import { PoiService } from './poi.service';

describe('PoiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [PoiService]
    });
  });

  it('should be created', inject([PoiService], (service: PoiService) => {
    expect(service).toBeTruthy();
  }));
});

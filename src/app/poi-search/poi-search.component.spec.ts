import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiSearchComponent } from './poi-search.component';
import { FakePoiService } from '../../../testing/fake-poi-service';
import { PoiService } from '../poi.service';

import { MatFormFieldStubComponent, MatInputStubDirective } from '../../../testing/mat-stub';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('PoiSearchComponent', () => {
  let component:PoiSearchComponent;
  let fixture:ComponentFixture<PoiSearchComponent>;
  let poiService:PoiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
          PoiSearchComponent,
          MatFormFieldStubComponent,
          MatInputStubDirective
        ],
        providers: [
          {provide: PoiService, useClass: FakePoiService} // using the fake poi service instead of the actual poi service
        ],
        imports: [
          MatAutocompleteModule
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    // create the component for testing
    fixture = TestBed.createComponent(PoiSearchComponent);

    // get the actual component for testing
    component = fixture.componentInstance;

    // FakePoiService actually injected into the component
    poiService = fixture.debugElement.injector.get(PoiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return Gaffel', () => {
    let dummy = component.filter("Gaf");
    console.info(dummy);
  });
});

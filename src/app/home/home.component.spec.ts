import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Router, RouterStub, ActivatedRoute, ActivatedRouteStub } from '../../../testing/router-stubs';
import { MatFormFieldStubComponent, MatSelectStubComponent, MatOptionStubComponent } from '../../../testing/mat-stub';
import { FakeParkingDataService } from '../../../testing/fake-parking-data-service';

import { ParkingDataService } from '../parking-data.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  let component:HomeComponent; // component under test
  let fixture:ComponentFixture<HomeComponent>;
  let parkingDataService:ParkingDataService;
  let route;

  /** asynchronous, because the template of the home component is separated from the component itself */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        providers: [
          {provide: Router, useClass: RouterStub}, // using the router stub instead of the actual router
          {provide: ParkingDataService, useClass: FakeParkingDataService}, // using the fake parking data service instead of the actual parking data service
          {provide: ActivatedRoute, useClass: ActivatedRouteStub} // using the activated route stub instead of the actual activated route
        ],
        declarations: [
          HomeComponent, // component under test
          /** stubs for material design components */
          MatFormFieldStubComponent,
          MatSelectStubComponent,
          MatOptionStubComponent
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    // creates an instance of the component for testing
    fixture = TestBed.createComponent(HomeComponent);

    // returns a handle for the component instance
    component = fixture.componentInstance;

    // FakeParkingDataService actually injected into the component
    parkingDataService = fixture.debugElement.injector.get(ParkingDataService);

    // ActivatedRouteStub actually injected into the component
    route = fixture.debugElement.injector.get(ActivatedRoute);
    route.testParams = {serverId: ''};

  });

  it('should be created', () => {
    // check if all dependencies are resolved and the component is created properly
    expect(component).toBeTruthy();
  });

  it('should have an undefined city list before ngOnInit', () => {
    expect(component.cities).not.toBeDefined();
  });

  it('should still have an undefined city list right after ngOnInit call (component initialization)', () => {
    fixture.detectChanges();
    expect(component.cities).not.toBeDefined();
  });

  it('should have new serverId when set before ngOnInit', () => {
    route.testParams = {serverId: 'open/paris'};

    fixture.detectChanges();
    expect(parkingDataService.getServerId()).toBe('open/paris');
  });

  it('should have new serverId when set in updateServerId()', () => {
    fixture.detectChanges()
    component.onSelectionChange({value:{serverId: 'open/paris', name:'paris'}});
    expect(parkingDataService.getServerId()).toBe('open/paris');
  });

  it('should have an defined city list after observable resolves', async(() => {
    fixture.detectChanges();
    // wait until asynchronous call is resolved
    fixture.whenStable().then(() => {
      expect(component.cities instanceof Array).toBeTruthy();
      expect(component.cities[0]).toEqual({name:'aachen', serverId:'open/aachen'});
      expect(component.cities).not.toEqual({name:'aachen', serverId:'open/aachen'});
    })
  }));
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingElementsComponent } from './parking-elements.component';

describe('ParkingElementsComponent', () => {
  let component: ParkingElementsComponent;
  let fixture: ComponentFixture<ParkingElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

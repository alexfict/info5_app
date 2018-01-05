import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterOutletStubComponent } from './../../testing/router-stubs';

// component under test
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let comp: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RouterOutletStubComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
  });

  it('should create the app component', async(() => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));

});

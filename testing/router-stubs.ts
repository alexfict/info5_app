import { Component, Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';

export { Router, ActivatedRoute } from '@angular/router';

/** The stubs do not contain any logic. That's because we do not want to test the Routing Service but the components
 * implementing this service */

/** Stub for the router-outlet element in the html template */
@Component({
  selector: 'router-outlet',
  template: ''
})
export class RouterOutletStubComponent {
}

/** Stub for the router */
@Injectable()
export class RouterStub {
  navigate(commands:any[]) {
    console.info('navigate to new direction ' + commands[0]);
  }
}

/** code taken from angular example docs */
// Only implements params and part of snapshot.params
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  // Test parameters
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams };
  }
}

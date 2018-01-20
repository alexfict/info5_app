import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';
import { FakeAuthService } from '../../../testing/fake-auth-service';
import { Router, RouterStub } from '../../../testing/router-stubs';

import { MatFormFieldStubComponent, MatButtonStubDirective, MatInputStubDirective } from '../../../testing/mat-stub';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignInComponent,
        MatFormFieldStubComponent
      ],
      providers:[
        {provide: Router, useClass: RouterStub},
        {provide: AuthService, useClass: FakeAuthService}
      ],
      imports:[
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

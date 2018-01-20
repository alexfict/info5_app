import { Component, Directive, Input } from '@angular/core';

@Component({
  selector: 'mat-form-field',
  template: ''
})
export class MatFormFieldStubComponent {
}

@Component({
  selector: 'mat-select',
  template: ''
})
export class MatSelectStubComponent {
}

@Component({
  selector: 'mat-option',
  template: ''
})
export class MatOptionStubComponent {
  @Input()
  value:string;
}

@Directive({
  selector: '[matInput]',
})
export class MatInputStubDirective {
  @Input()
  formControl:any;

  @Input()
  matAutocomplete:any;

  @Input()
  ngModel:any;
}

@Directive({
  selector: '[matButton]'
})
export class MatButtonStubDirective {
}

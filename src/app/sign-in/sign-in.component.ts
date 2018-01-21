import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public user = {username: '', password: ''};

  constructor(private authService:AuthService,
              private router:Router) {
  }

  ngOnInit() {
  }

  public onSubmit():void {

    this.authService.setCredentials(this.user);

    this.router.navigate(['city']);

  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  hideContainer = true;
  forgotPassword:number = 1;


  constructor(
    private router:Router
  ) { }

  ngOnInit() {
  }

  sendPassword(){
    this.forgotPassword = 2;
  }

  cancel(){
    this.router.navigate(['/login']);
  }

}

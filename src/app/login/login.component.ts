import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, Routes, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service'
import { ValidationService } from '../shared/services/validation.service';
import { GetJsonService } from '../shared/services/json.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  afterLogin: any = true;
  loginErrorMsz: any;
  messages:any={};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validationService: ValidationService,
    private jsonService:GetJsonService,

  ) { }

  ngOnInit() {
    this.initForm();
    this.getMessages('messages');
  }

  getMessages(name) {
    this.jsonService.getJSON(name).subscribe((res:any) => {
      console.log(res);
      if(res){
        this.messages = res;        
      }
    }, err => {
    })
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
    })
  }

  login() {
    const loginPostObj = this.loginForm.value
    this.authService.login(loginPostObj).subscribe((res: any) => {
      this.router.navigate(['/customersview']);
    }, err => {
      this.loginErrorMsz = err && err.message[0] && err.message[0].msg  ? err.message[0].msg : err.message;
      setTimeout(() => {
        this.loginErrorMsz = "";      
      }, 2000);
    })
  }

  restrictLeadingSpace(event) {
    let strInput = event.target.value;
    if (!strInput.length) {
      event.preventDefault();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, Routes, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service'
import { ValidationService } from '../shared/services/validation.service';
import { GetJsonService } from '../shared/services/json.service';
import { UtilService } from '../shared/services/util.service';

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
  userRole:any=null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validationService: ValidationService,
    private jsonService:GetJsonService,
    private utilService:UtilService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getMessages('messages');
    this.userRole = this.utilService.userRole;
    console.log('this.userRole',this.userRole)
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
      this.userRole = this.utilService.userRole;
      console.log('this.userRole',this.userRole)
      this.authService.setLoggedIn({ loggedIn: true });
      if(this.userRole === 3){
        this.router.navigate(['/azuresubscriptions']);
      }else if(this.userRole === 4){
        this.router.navigate(['/editplayaprofile']);
      } else{
        this.router.navigate(['/customersview']);
      }
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

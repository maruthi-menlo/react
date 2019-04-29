import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, Routes, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service'
import { ValidationService } from '../shared/services/validation.service';
import { GetJsonService } from '../shared/services/json.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  forgotPassword:number = 1;
  errorMsg: any;
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
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
    })
  }



  sendPassword() {
    const fgtPwdPostObj = this.forgotPasswordForm.value
    this.authService.forgotPassword(fgtPwdPostObj).subscribe((res: any) => {
      this.forgotPassword = 2;
    }, err => {
      const errorObj = err.error
      this.errorMsg = errorObj && errorObj.message ? errorObj.message : '' ;
      setTimeout(() => {
        this.errorMsg = "";      
      }, 2000);
    })
  }

  cancel(){
    this.router.navigate(['/login']);
  }

}

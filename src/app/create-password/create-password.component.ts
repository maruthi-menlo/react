import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ValidationService } from '../shared/services/validation.service';
import { MustMatch } from '../shared/services/must-match.validator';
import { GetJsonService } from '../shared/services/json.service';
import { UtilService } from '../shared/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {

  createPasswordForm: FormGroup;
  messages:any={};
  userid:string = '';
  passwordPostObj:any = {};
  validPasswordToken:boolean = false;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private jsonService:GetJsonService,
    private route:ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.getMessages('messages');
    this.route.queryParams.subscribe(params => {
      if(params && params.token) {
        this.userid = params.token;
      }
      this.validateToken();
    });
  }

  validateToken() {
    const data = {token:this.userid}
    this.authService.validatePasswordToken(data).subscribe((res:any) => {
      this.validPasswordToken = true;
    }, err => {
      this.authService.logout();
      this.validPasswordToken = false;
    })
  }

  getMessages(name) {
    this.jsonService.getJSON(name).subscribe((res:any) => {
      if(res){
        this.messages = res;        
      }
    }, err => {
    })
  }

  initForm() {
    this.createPasswordForm = this.fb.group({      
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      newpassword: ['',Validators.compose([Validators.required])]
    },{
      validator: MustMatch('password', 'newpassword')
    })
  }

  submitPwd(){
    let password = this.createPasswordForm.controls.password.value;
    const passwordPostObj= {userid:this.userid,password:password};
    this.authService.createPassword(passwordPostObj).subscribe((res:any) => {
      alert("Password changed successfully") 
      setTimeout(() => {
        this.router.navigate(['/login'])     
      }, 1500);
    }, err => {
    })
  };

  cancel(){
    this.router.navigate(['/customersview']);
  }

}

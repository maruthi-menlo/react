import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ValidationService } from '../shared/services/validation.service';
import { MustMatch } from '../shared/services/must-match.validator';
import { GetJsonService } from '../shared/services/json.service';
import { UtilService } from '../shared/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../shared/services/customer.service';
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

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private jsonService:GetJsonService,
    private route:ActivatedRoute,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.getMessages('messages');
    this.route.queryParams.subscribe(params => {
      if(params && params.token) {
        this.userid = params.token;
      }
    });
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
    console.log(passwordPostObj)
    this.customerService.createPassword(passwordPostObj).subscribe((res:any) => {
      console.log(res);      
    }, err => {
    })
  };

  // cancel(){
  //   this.router.navigate(['/customersview']);
  // }

}

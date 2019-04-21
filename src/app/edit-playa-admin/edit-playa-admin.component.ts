import { Component, OnInit } from '@angular/core';
import { UtilService } from '../shared/services/util.service';
import { AuthService } from '../auth/auth.service'
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ValidationService } from '../shared/services/validation.service';
import { MustMatch } from '../shared/services/must-match.validator';
import { CustomerService } from '../shared/services/customer.service';
import { ToastService } from '../shared/services/toaster.service';

@Component({
  selector: 'app-edit-playa-admin',
  templateUrl: './edit-playa-admin.component.html',
  styleUrls: ['./edit-playa-admin.component.scss']
})
export class EditPlayaAdminComponent implements OnInit {

  editPlayaProfileForm: FormGroup;
  user: any;
  errorMsz:string = '';
  upateUser: any;

  constructor(
    private utilService:UtilService,
    private authService:AuthService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private customerService: CustomerService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.getCurrentUser();
    this.initForm();
  }

  getCurrentUser() {    
    this.user = this.authService.getCurrentUser;
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer')
  }

  cancel(){
    this.router.navigate(['/customersview']);
  }

  initForm() {
    this.editPlayaProfileForm = this.fb.group({ 
      firstname: [this.user ? this.user.firstname : '', Validators.compose([Validators.required])],
      lastname: [this.user ? this.user.lastname : '', Validators.compose([Validators.required])],
      email: [this.user ? this.user.email : '', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])], 
      oldpassword: ['', Validators.compose([Validators.required])],
      newpassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      newpasswordagain: ['',Validators.compose([Validators.required])]
    },{
      validator: MustMatch('newpassword', 'newpasswordagain')
    })
  }

  submit(){
    const editPostObj = this.editPlayaProfileForm.value;
    this.customerService.editPlayaUserData(editPostObj).subscribe((res:any) => {
      const user = JSON.parse(localStorage.getItem('profile'));
      user['firstname'] = editPostObj.firstname;
      user['lastname'] = editPostObj.lastname;
      user['email'] = editPostObj.email;
      user['name'] = editPostObj.firstname + ' ' + editPostObj.lastname;
      localStorage.setItem('profile', JSON.stringify(user));
      const message = 'Profile has been updated successfully.'
      this.showToast(message);
      setTimeout(() => {
        this.router.navigate(['/customersview']);
      }, 100);
    }, err => {
      this.errorMsz = err && err.error ? err.error.message : '';
    })
  }

  showToast(message) {
    this.toastService.show({
      text: message,
      type: 'success',
    });
  }

}

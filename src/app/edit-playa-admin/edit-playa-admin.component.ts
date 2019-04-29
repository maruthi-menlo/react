import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from '../shared/services/util.service';
import { AuthService } from '../auth/auth.service'
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ValidationService } from '../shared/services/validation.service';
import { MustMatch } from '../shared/services/must-match.validator';
import { CustomerService } from '../shared/services/customer.service';
import { ToastService } from '../shared/services/toaster.service';
import { GetJsonService } from '../shared/services/json.service';

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
  userRole:any=null;
  imageFile:any;
  logoObj:any={};
  messages:any={};
  logoError:boolean = false;
  removelogo:boolean =false;
  @ViewChild('btnColor') btnColor; 

  constructor(
    private utilService:UtilService,
    private authService:AuthService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private jsonService:GetJsonService,
    private customerService: CustomerService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.userRole = this.utilService.userRole;
    this.getCurrentUser();
    this.initForm();
  }

  getCurrentUser() {    
    this.user = this.authService.getCurrentUser;
    if(this.userRole === 2 && this.user.brandinginfo[0].logoPath) {
      this.logoObj.fileUrl = this.user.brandinginfo[0].logoPath
    }
  }

  getMessages(name) {
    this.jsonService.getJSON(name).subscribe((res:any) => {
      if(res){
        this.messages = res;        
      }
    }, err => {
    })
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer');
    this.updateBtnColor();
  }

  cancel(){
    if(this.userRole === 3){
      this.router.navigate(['/azuresubscriptions']);
    }else if(this.userRole === 4){
      this.router.navigate(['/editplayaprofile']);
    } else{
      this.router.navigate(['/customersview']);
    }
  }

  initForm() {
    this.editPlayaProfileForm = this.fb.group({ 
      firstname: [this.user ? this.user.firstname : '', Validators.compose([Validators.required])],
      lastname: [this.user ? this.user.lastname : '', Validators.compose([Validators.required])],
      email: [this.user ? this.user.email : '', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])], 
      oldpassword: ['', Validators.compose([Validators.required])],
      newpassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      newpasswordagain: ['',Validators.compose([Validators.required])],
      logo : [''],
      headerHexCode : [this.user && this.user.brandinginfo[0] ? this.user.brandinginfo[0].headerHexCode :''],
      primaryButtonHexCode : [this.user && this.user.brandinginfo[0] ? this.user.brandinginfo[0].primaryButtonHexCode :''],
      activeFieldHexCode : [this.user && this.user.brandinginfo[0] ? this.user.brandinginfo[0].activeFieldHexCode :''],
    },{
      validator: MustMatch('newpassword', 'newpasswordagain')
    })
  }

  imageChangeEvent(imageEvent, formControl){
    let reader = new FileReader();
    this[`${formControl}Obj`] = {};
    let fileList: FileList = imageEvent.target.files;
    this.imageFile = imageEvent.target.files[0];
    if (fileList.length > 0 && this.imageFile.size <= 16777216 && (this.imageFile.type === 'image/png' || this.imageFile.type === 'image/jpg' || this.imageFile.type === 'image/jpeg')) {
      this[`${formControl}Error`] = false;
      this.removelogo = false;
      this.editPlayaProfileForm.controls[formControl].setValue(this.imageFile);
      reader.readAsDataURL(this.imageFile);
      reader.onload = () => {
        this[`${formControl}Obj`] = {
          fileUrl: reader.result,
          fileName: this.imageFile.name,
          fileSize: this.utilService.formatFileSize(this.imageFile.size, 0)
        }
    }
      
    } else {
      this.resetFileInput();
      this[`${formControl}Error`] = true;
    }
  }

  resetFileInput(element?) {
    this.logoObj = {}
    this.removelogo = true;
  }

  submit(){
    if(this.userRole === 2) {
      this.adminSubmit()
    } else if (this.userRole === 1){
      this.userSubmit();
    } else {
      this.customerAdminUserSubmit();
    }
  }

  adminSubmit() {
    const editPostObj = this.editPlayaProfileForm.value;
    editPostObj['removelogo'] = this.removelogo;
    this.customerService.updateCSPAdminProfile(editPostObj).subscribe((res:any) => {
      this.updateLocalStorage(editPostObj,'admin',res)
    }, err => {
      this.errorMsz = err && err.error ? err.error.message : '';
    })
  }

  customerAdminUserSubmit(){
    const editPostObj = this.editPlayaProfileForm.value;
    this.customerService.customerAdminUserSubmit(editPostObj).subscribe((res:any) => {
      this.updateLocalStorage(editPostObj)
    }, err => {
      this.errorMsz = err && err.error ? err.error.message : '';
    })
  }
  userSubmit() {
    const editPostObj = this.editPlayaProfileForm.value;
    this.customerService.editPlayaUserData(editPostObj).subscribe((res:any) => {
      this.updateLocalStorage(editPostObj)
    }, err => {
      this.errorMsz = err && err.error ? err.error.message : '';
    })
  }


  updateLocalStorage(editPostObj,type?,res?) {
    const user = JSON.parse(localStorage.getItem('profile'));
    user['firstname'] = editPostObj.firstname;
    user['lastname'] = editPostObj.lastname;
    user['email'] = editPostObj.email;
    user['name'] = editPostObj.firstname + ' ' + editPostObj.lastname;
    if(type === 'admin') {
      user['brandinginfo'][0]['logoPath'] = res.logopath
      user['brandinginfo'][0]['primaryButtonHexCode'] = editPostObj.primaryButtonHexCode
      user['brandinginfo'][0]['activeFieldHexCode'] = editPostObj.activeFieldHexCode
      user['brandinginfo'][0]['headerHexCode'] = editPostObj.headerHexCode
    }
    localStorage.setItem('profile', JSON.stringify(user));
    const message = 'Profile has been updated successfully.'
    this.showToast(message);
    window.scrollTo(0,0)
    setTimeout(() => {
      this.authService.setLoggedIn({ loggedIn: true });
      if(this.userRole === 3){
        this.router.navigate(['/azuresubscriptions']);
      }else if(this.userRole === 4){
        this.router.navigate(['/editplayaprofile']);
      } else{
        this.router.navigate(['/customersview']);
      }
    }, 100);
  }

  showToast(message) {
    this.toastService.show({
      text: message,
      type: 'success',
    });
  }

  updateBtnColor () {
    this.btnColor.nativeElement.style.backgroundColor = this.utilService.primaryButtonHexCode;
  }

}

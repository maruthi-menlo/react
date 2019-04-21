import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from '../shared/services/customer.service';
import { ValidationService } from '../shared/services/validation.service';
import { Router,ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/util.service';
import { GetJsonService } from '../shared/services/json.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DeactivateEditUserComponent } from '../core/modals/deactivate-edit-user/deactivate-edit-user.component';
import { ToastService } from '../shared/services/toaster.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  customerForm: FormGroup;
  userDetailsObj: FormGroup;
  azureSubDetailsObj: FormGroup;
  customerTypeValue: any = 'DC';
  type:any = 'add';
  cspUserDetailsObj: FormGroup;
  allCountries: any=[];
  allStates:any=[];
  allRoles:any=[];
  messages:any={};
  imageFile:any;
  logoObj:any={};
  logoError:boolean = false;
  addCustomer:boolean = true;
  cspCustomerForm:  FormGroup;
  openDeleteUserModal = true;
  closeResult: string;
  errorMsz:string = '';
  editDCdetails: any;
  editCSPdetails: any;
  data:any;
  customerid:any = '';
  @ViewChild('fileInput') imageUpload: any;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route:ActivatedRoute,
    private utilService:UtilService,
    private jsonService:GetJsonService,
    private validationService: ValidationService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.type = this.router.url.indexOf('editcustomer') > -1 ? 'edit' : 'add';
    this.initForm();
    this.initCSPForm();
    this.getMessages('messages');
    this.fetchEditCustomerDetails();
  }

  fetchEditCustomerDetails() {
    if(this.type === 'edit') {
      this.customerid = this.customerService.getCustomerId;
      this.addCustomer = false;
      this.customerTypeValue = this.router.url.indexOf('CSP') > -1 ? 'CSP' : 'DC';
      if(this.customerTypeValue === 'DC') {
        this.getDCDetails();
      } else{
        this.getCSPDetails();
      }
    }
    this.getAllCountries();
    this.getAllRoles(this.customerTypeValue);
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer');
  }

  getMessages(name) {
    this.jsonService.getJSON(name).subscribe((res:any) => {
      if(res){
        this.messages = res;        
      }
    }, err => {
    })
  }

  get userDetails() {
    return this.customerForm.get('users') as FormArray;
  }

  get azureSubDetails() {
    return this.customerForm.get('azuresubscriptions') as FormArray;
  }

  addUserDetails(data?,idx?){
    let formArrayDetails = this.customerForm.controls['users'] as FormArray;
    formArrayDetails.push(this.fb.group({
      id: [data ? data.id : ''],
      firstname: [data ? data.firstname : '', Validators.compose([Validators.required])],
      lastname: [data ? data.lastname : '', Validators.compose([Validators.required])],
      email: [data ? data.email : '', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
      roleid: [data ? data.roleid : '', Validators.compose([Validators.required])]
    }))
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  addCSPUserDetails(data?, idx?){
    let cspFormArrayDetails = this.cspCustomerForm.controls['users'] as FormArray;
    cspFormArrayDetails.push(this.fb.group({
      id: [data ? data.id : ''],
      firstname: [data ? data.firstname : '', Validators.compose([Validators.required])],
      lastname: [data ? data.lastname : '', Validators.compose([Validators.required])],
      email: [data ? data.email : '', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
      roleid: [data ? data.roleid : '', Validators.compose([Validators.required])]
    }))
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  addazureSubDetails(data?, idx?) {
    let formArray = this.customerForm.controls['azuresubscriptions'] as FormArray;
    formArray.push(this.fb.group({
      id: [data ? data.id : ''],
      subscriptionid: [data? data.subscriptionId: '', Validators.compose([Validators.required])],
      markup: ['', Validators.compose([Validators.required])],
      markupMask: ['', Validators.compose([Validators.required])],
      discount: ['', Validators.compose([Validators.required])],
      discountMask: ['', Validators.compose([Validators.required])]
    }));

    if(data){
      this.percentBlur(data.markup,idx,'azuresubscriptions','markup');
      this.percentBlur(data.discount,idx,'azuresubscriptions','discount');
    }
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }
 
  initForm(data?){
    this.customerForm = this.fb.group({
      companyname: [data ? data.companyname : '', Validators.compose([Validators.required])],
      tenantid: [data ? data.tenantid : '', Validators.compose([Validators.required])],
      address1: [data ? data.address1 : '', Validators.compose([Validators.required])],
      address2: [data ? data.address2 : '', Validators.compose([Validators.required])],
      city: [data ? data.city : '', Validators.compose([Validators.required])],
      zipcode: [data ? data.zipcode : '', Validators.compose([Validators.required, Validators.pattern(this.validationService.number_regexPattern)])],
      countryid: [data ? data.countryid : '', Validators.compose([Validators.required])],
      stateid: [data ? data.stateid : '', Validators.compose([Validators.required])],
      users: this.fb.array([ ]),
      azuresubscriptions: this.fb.array([ ])
    });
    [1].forEach(ele => {
      if(data && data.users.length){
        data.users.forEach((eachuser, index) => {
          this.addUserDetails(eachuser,index);
        })
      } else{
        this.addUserDetails(null,null);
      }      
    }),
    [1].forEach(ele => {
      if(data && data.azuresubscriptions.length){
        data.azuresubscriptions.forEach((eachSubscriptionObj, index) => {    
          this.addazureSubDetails(eachSubscriptionObj, index);
        });
      }else{
        this.addazureSubDetails(null, null);
      }
      
    })
  }

  initCSPForm(data?){
    this.cspCustomerForm = this.fb.group({
      companyname : [data ? data.companyname : '', Validators.compose([Validators.required])],      
      address1: [data ? data.address1 : '', Validators.compose([Validators.required])],
      address2: [data ? data.address2 : '', Validators.compose([Validators.required])],
      city: [data ? data.city : '', Validators.compose([Validators.required])],
      zipcode: [data ? data.zipcode : '', Validators.compose([Validators.required])],
      countryid: [data ? data.countryid : '', Validators.compose([Validators.required])],
      stateid: [data ? data.stateid : '', Validators.compose([Validators.required])],
      logo : [''],
      headerHexCode : [''],
      primaryButtonHexCode : [''],
      activeFieldHexCode : [''],
      users: this.fb.array([ ])
    });
    [1].forEach(ele => {
      if(data && data.users.length){
        data.users.forEach((eachUser, index) =>{
          this.addCSPUserDetails(eachUser, index);
        })
      } else{
        this.addCSPUserDetails(null,null);
      }  
    })
  }

  customerType(event: any){
    this.customerTypeValue = event.target.value;
    this.customerForm.reset();
    this.cspCustomerForm.reset();
    this.getAllRoles(this.customerTypeValue);
    this.setDefaultValues(event.target.value)
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  setDefaultValues(value?) {
      const formArrayName = value === 'DC' ? 'customerForm' : 'cspCustomerForm'
      this.setUSDefault(formArrayName,'countryid',222);
      this.setUSDefault(formArrayName,'stateid','');
      this.getStatesForCountry(222);
      this.setRoleDefaultAdministrator(formArrayName,'users','roleid', value === 'DC' ? 3 : 2);
  }

  //to get all the countries
  getAllCountries(){
    this.customerService.getCountries().subscribe((res:any) => {
      if(!res.error){
        this.allCountries = res.data;
        this.setUSDefault('customerForm','countryid',222);
        this.getStatesForCountry(222)
      }
    }, err => {
    })
  }

  getAllRoles(type?){
    this.customerService.getRoles(type).subscribe((res:any) => {
      if(!res.error){
        this.allRoles = res.data;
        this.setRoleDefaultAdministrator('customerForm','users','roleid', 3)
      }
    }, err => {
    })
  }

  //to get the states for the selected country
  getStatesForCountry(value){
    this.customerService.getCountryStates(value).subscribe((res:any) => {
      if(!res.error){
        this.allStates = res.data;
      }
    }, err => {
    })
  }

  //Set default role as administrator
  setRoleDefaultAdministrator(formBuilder,formArray, formControl,value) {
    let usersArray = this[formBuilder].controls[formArray]['controls'] as FormArray;
    usersArray[0].controls[formControl].setValue(value);
  }

  //Set default role as administrator
  setUSDefault(formBuilder, formControl,value) {
    this[formBuilder].controls[formControl].setValue(value);
  }

  imageChangeEvent(imageEvent, formControl){
    let reader = new FileReader();
    this[`${formControl}Obj`] = {};
    let fileList: FileList = imageEvent.target.files;
    this.imageFile = imageEvent.target.files[0];
    if (fileList.length > 0 && this.imageFile.size <= 16777216 && (this.imageFile.type === 'image/png' || this.imageFile.type === 'image/jpg' || this.imageFile.type === 'image/jpeg')) {
      this[`${formControl}Error`] = false;
      this.cspCustomerForm.controls[formControl].setValue(this.imageFile);
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
  }
  
  submit(){
    let addCustomerPostObj = this.customerForm.value;
    if(this.type === 'edit') {
      addCustomerPostObj['customerid'] = this.customerid
    }
    this.customerService.addCustomer(addCustomerPostObj,this.type).subscribe((res:any) => {
      const editDC = 'Direct customer has been updated successfully.'
      const addDC = 'Direct customer has been added successfully.'
      if(this.type === 'edit') {
        this.showToast(editDC);
      }else{
        this.showToast(addDC);
      }
      // alert('Direct customer has been created successfully.');
      setTimeout(() => {
        this.router.navigate(['/customersview']);
      }, 500);

    }, err => {
      this.errorMsz = err && err.error ? err.error.message : '';
    })
  }

  navigateToCustomerPage() {
    this.router.navigate(['/customersview']);
  }

  openDeleteModal(content) {
    this.modalService.open(DeactivateEditUserComponent,{ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'customDeactivateModal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
  submitCSP(){
    let addCspPostObj = this.cspCustomerForm.value;
    if(this.type === 'edit') {
      addCspPostObj['customerid'] = this.customerid
    }
    this.customerService.addCSPCustomer(addCspPostObj,this.type).subscribe((res:any) => {
      // alert('CSP customer has been created successfully.');
      const editCsp = 'CSP customer has been updated successfully.'
      const addCsp = 'CSP customer has been added successfully.'
      if(this.type === 'edit') {
        this.showToast(editCsp);
      }else{
        this.showToast(addCsp);
      }
      setTimeout(() => {
        this.router.navigate(['/customersview']);
      }, 500);
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

  cancel(){
    this.router.navigate(['/customersview']);
  }

  percentBlur(e,id,formArray,formControl) {
    let value = '';
    if(e == null){
      value = '';
    }
    else if(e.target){
      value = e.target.value ? e.target.value : '';
    }else {
      value = e;
    }
    let maskValue = value ? `${value}%` : value;
    let azureSubscription = this.customerForm.controls[formArray]['controls'] as FormArray;
    azureSubscription[id].controls[`${formControl}Mask`].setValue(maskValue);
    azureSubscription[id].controls[formControl].setValue(value);
  }

  percentFocus(id,formArray,formControl) {
    let azureSubscription = this.customerForm.controls[formArray]['controls'] as FormArray;
    let markupValue = azureSubscription[id].controls[formControl].value;
    azureSubscription[id].controls[`${formControl}Mask`].setValue(markupValue);
  }

  getDCDetails(){
    if(this.customerid) {
      const postObj = {customerid:this.customerid}
      this.customerService.getDCUserData(postObj).subscribe((res:any) => {
        this.editDCdetails = res.data;
        this.initForm(this.editDCdetails);
      }, err => {
        this.errorMsz = err && err.error ? err.error.message : '';
      })
    }
  }

  getCSPDetails(){
    if(this.customerid) {
      const postObj = {customerid:this.customerid}
      this.customerService.getCSPUserData(postObj).subscribe((res:any) => {
        this.editCSPdetails = res.data;
        this.initCSPForm(this.editCSPdetails);
      }, err => {
        this.errorMsz = err && err.error ? err.error.message : '';
      })

    }
  }

}

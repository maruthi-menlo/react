import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from '../shared/services/customer.service';
import { ValidationService } from '../shared/services/validation.service';
import { Router } from '@angular/router';
import { UtilService } from '../shared/services/util.service';
import { GetJsonService } from '../shared/services/json.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DeactivateEditUserComponent } from '../core/modals/deactivate-edit-user/deactivate-edit-user.component'

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
  @ViewChild('fileInput') imageUpload: any;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private utilService:UtilService,
    private jsonService:GetJsonService,
    private validationService: ValidationService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.addCustomer = this.router.url.indexOf('DC') > -1 || this.router.url.indexOf('CSP') > -1 ? false : true;
    this.customerTypeValue = this.router.url.indexOf('CSP') > -1 ? 'CSP' : 'DC';
    this.initForm();
    this.initCSPForm();
    this.getAllCountries();
    this.getAllRoles();
    this.getMessages('messages');
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

  addUserDetails(){
    let formArrayDetails = this.customerForm.controls['users'] as FormArray;
    formArrayDetails.push(this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
      roleid: ['', Validators.compose([Validators.required])]
    }))
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  addCSPUserDetails(){
    let cspFormArrayDetails = this.cspCustomerForm.controls['users'] as FormArray;
    cspFormArrayDetails.push(this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
      roleid: ['', Validators.compose([Validators.required])]
    }))
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  addazureSubDetails() {
    let formArray = this.customerForm.controls['azuresubscriptions'] as FormArray;
    formArray.push(this.fb.group({
      subscriptionid: ['', Validators.compose([Validators.required])],
      markup: ['', Validators.compose([Validators.required])],
      markupMask: ['', Validators.compose([Validators.required])],
      discount: ['', Validators.compose([Validators.required])],
      discountMask: ['', Validators.compose([Validators.required])]
    }));
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }
 
  initForm(){
    this.customerForm = this.fb.group({
      companyname: ['', Validators.compose([Validators.required])],
      tenantid: ['', Validators.compose([Validators.required])],
      address1: ['', Validators.compose([Validators.required])],
      address2: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required, Validators.pattern(this.validationService.number_regexPattern)])],
      countryid: ['', Validators.compose([Validators.required])],
      stateid: ['', Validators.compose([Validators.required])],
      users: this.fb.array([ ]),
      azuresubscriptions: this.fb.array([ ])
    });
    [1].forEach(ele => {
      this.addUserDetails();
    }),
    [1].forEach(ele => {
      this.addazureSubDetails();
    })
  }

  initCSPForm(){
    this.cspCustomerForm = this.fb.group({
      companyname : ['', Validators.compose([Validators.required])],      
      address1: ['', Validators.compose([Validators.required])],
      address2: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])],
      countryid: ['', Validators.compose([Validators.required])],
      stateid: ['', Validators.compose([Validators.required])],
      logo : [''],
      headerHexCode : [''],
      primaryButtonHexCode : [''],
      activeFieldHexCode : [''],
      users: this.fb.array([ ])
    });
    [1].forEach(ele => {
      this.addCSPUserDetails();
    })
  }

  customerType(event: any){
    this.customerTypeValue = event.target.value;
    this.customerForm.reset();
    this.cspCustomerForm.reset();
    this.setDefaultValues()
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  setDefaultValues() {
    if(this.customerTypeValue == 'CSP') {
      this.setUSDefault('cspCustomerForm','countryid',222);
      this.getStatesForCountry(222);
      this.setRoleDefaultAdministrator('cspCustomerForm','users','roleid',2)
    } else {
      this.setUSDefault('customerForm','countryid',222);
      this.getStatesForCountry(222);
      this.setRoleDefaultAdministrator('customerForm','users','roleid',2);
    }
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

  getAllRoles(){
    this.customerService.getRoles().subscribe((res:any) => {
      if(!res.error){
        this.allRoles = res.data;
        this.setRoleDefaultAdministrator('customerForm','users','roleid',2)
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
    const addCustomerPostObj = this.customerForm.value
    this.customerService.addCustomer(addCustomerPostObj).subscribe((res:any) => {
      alert('Direct customer has been created successfully.');
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
    const addCspPostObj = this.cspCustomerForm.value
    this.customerService.addCSPCustomer(addCspPostObj).subscribe((res:any) => {
      alert('CSP customer has been created successfully.');
      setTimeout(() => {
        this.router.navigate(['/customersview']);
      }, 500);
    }, err => {
      this.errorMsz = err && err.error ? err.error.message : '';
    })
  }

  cancel(){
    this.router.navigate(['/customersview']);
  }

  percentBlur(e,id,formArray,formControl) {
    let value = e.target.value;
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

}

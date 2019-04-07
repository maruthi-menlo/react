import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from '../shared/services/customer.service';
import { ValidationService } from '../shared/services/validation.service';
import { Router } from '@angular/router';
import { UtilService } from '../shared/services/util.service';
import { GetJsonService } from '../shared/services/json.service';

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
  cspCustomerForm:  FormGroup;
  @ViewChild('fileInput') imageUpload: any;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private utilService:UtilService,
    private jsonService:GetJsonService,
    private validationService: ValidationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initCSPForm();
    this.getAllCountries();
    this.getAllRoles();
    this.getMessages('messages');
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer')
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

  get userDetails() {
    return this.customerForm.get('users') as FormArray;
  }

  get azureSubDetails() {
    return this.customerForm.get('azuresubscriptions') as FormArray;
  }

  // get cspUserDetails() {
  //   return this.customerForm.get('cspUserDetails') as FormArray;
  // }


  // addUserDetails() {
  //   this.userDetails.push(this.userDetailsObj);
  // }

  // cspAddUserDetails() {
  //   this.cspUserDetails.push(this.cspUserDetailsObj);
  // }

  addUserDetails(){
    let formArrayDetails = this.customerForm.controls['users'] as FormArray;
    formArrayDetails.push(this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
      roleid: ['', Validators.compose([Validators.required])]
    }))
  }

  addCSPUserDetails(){
    let cspFormArrayDetails = this.cspCustomerForm.controls['users'] as FormArray;
    cspFormArrayDetails.push(this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
      roleid: ['', Validators.compose([Validators.required])]
    }))
  }

  addazureSubDetails() {
    let formArray = this.customerForm.controls['azuresubscriptions'] as FormArray;
    formArray.push(this.fb.group({
      subscriptionid: ['', Validators.compose([Validators.required])],
      markup: ['', Validators.compose([Validators.required])],
      discount: ['', Validators.compose([Validators.required])]
    }));
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
    [1,2,3].forEach(ele => {
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
    this.customerTypeValue = event.target.value
    // console.log('radio',this.customerTypeValue)
  }

  //to get all the countries
  getAllCountries(){
    this.customerService.getCountries().subscribe((res:any) => {
      if(!res.error){
        this.allCountries = res.data;
        // this.cardAndBillingDetailsForm.controls['country'].setValue(this.allCountries[0].countryId);
      } else {
      } 
    }, err => {
    })
  }

  getAllRoles(){
    this.customerService.getRoles().subscribe((res:any) => {
      if(!res.error){
        this.allRoles = res.data;
        console.log(this.allRoles);
      }else{
      }
    }, err => {
    })
  }

  //to get the states for the selected country
  getStatesForCountry(value){
    // this.customerForm.controls['state'].setValue('');
    this.customerService.getCountryStates(value).subscribe((res:any) => {
      if(!res.error){
        this.allStates = res.data;
      } else {
      } 
    }, err => {
    })
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
    // this[element].nativeElement.value = "";
    this.logoObj = {}
  }
  
  submit(){
    const addCustomerPostObj = this.customerForm.value
    this.customerService.addCustomer(addCustomerPostObj).subscribe((res:any) => {
      console.log(res);
      this.router.navigate(['/customersview']);
    }, err => {
    })
  }

  navigateToCustomerPage() {
    this.router.navigate(['/customersview']);
  }
  
  submitCSP(){
    const addCspPostObj = this.cspCustomerForm.value
    console.log(addCspPostObj)
    this.customerService.addCSPCustomer(addCspPostObj).subscribe((res:any) => {
      console.log(res);
    }, err => {
    })
  }

  cancel(){
    this.router.navigate(['/customersview']);
  }
}

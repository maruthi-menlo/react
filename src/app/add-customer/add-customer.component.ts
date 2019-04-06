import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from '../shared/services/customer.service';
import { ValidationService } from '../shared/services/validation.service';

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

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private validationService: ValidationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getAllCountries();
    this.getAllRoles();
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
      zipcode: ['', Validators.compose([Validators.required])],
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

  customerType(event: any){
    this.customerTypeValue = event.target.value
    console.log('radio',this.customerTypeValue)
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

  submit(){
    const addCustomerPostObj = this.customerForm.value
    this.customerService.addCustomer(addCustomerPostObj).subscribe((res:any) => {
      console.log(res);
    }, err => {
    })
  }
}

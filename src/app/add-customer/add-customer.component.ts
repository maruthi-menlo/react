import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from '../shared/services/customer.service';
import { ValidationService } from '../shared/services/validation.service';
import { Router,ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/util.service';
import { GetJsonService } from '../shared/services/json.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DeactivateEditUserComponent } from '../core/modals/deactivate-edit-user/deactivate-edit-user.component';
import { ToastService } from '../shared/services/toaster.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';


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
  removelogo:boolean =false;
  addCustomer:boolean = true;
  cspCustomerForm:  FormGroup;
  openDeleteUserModal = true;
  closeResult: string;
  errorMsz:string = '';
  editDCdetails: any;
  editCSPdetails: any;
  data:any;
  customerid:any = '';
  userRole:any=null;
  @ViewChild('fileInput') imageUpload: any;
  public removeSelectedArray : any;
  deleteRow:Subscription;
  destroySubscription$: Subject<boolean> = new Subject();
  @ViewChild('btnColor') btnColor: any;

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
  ) {
    
   }

  ngOnInit() {
    
    this.deleteRow = this.customerService.row
    .pipe(takeUntil(this.destroySubscription$))
    .subscribe((data: any) => {
      if(data) {
        let getArray = this[data['formBuilder']].controls[data['formArray']] as FormArray;
        getArray.removeAt(data['index']);
        setTimeout(() => {
          this.utilService.setNavHeight('commonContainer')
        }, 100);
      }
    });
    this.type = this.router.url.indexOf('editcustomer') > -1 ? 'edit' : 'add';
    this.getMessages('messages');
    this.fetchCustomerDetails();
    this.userRole = this.utilService.userRole;
  }

  fetchCustomerDetails() {
    if(this.type === 'edit') {
      this.customerid = this.customerService.getCustomerId;
      this.addCustomer = false;
      this.customerTypeValue = this.router.url.indexOf('CSP') > -1 ? 'CSP' : 'DC';
      if(this.customerTypeValue === 'DC') {
        this.getDCDetails();
      } else{
        this.getCSPDetails();
      }
    } else {
      this.customerTypeValue = this.router.url.indexOf('addcsp') > -1 ? 'CSP' : 'DC';
    }
    this.getAllCountries();
    this.getAllRoles(this.customerTypeValue);
    this.initForm();
    this.initCSPForm();
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer');
    this.updateBtnColor();
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
      firstname: [data ? data.firstname.trim() : '', Validators.compose([Validators.required])],
      lastname: [data ? data.lastname.trim() : '', Validators.compose([Validators.required])],
      email: [data ? data.email.trim() : '', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
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
      firstname: [data ? data.firstname.trim() : '', Validators.compose([Validators.required])],
      lastname: [data ? data.lastname.trim() : '', Validators.compose([Validators.required])],
      email: [data ? data.email.trim() : '', Validators.compose([Validators.required, Validators.pattern(this.validationService.email_regexPattern)])],
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
      subscriptionid: [data? data.subscriptionId.trim(): ''],
      markup: [''],
      markupMask: [''],
      discount: [''],
      discountMask: ['']
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
      companyname: [data ? data.companyname.trim() : '', Validators.compose([Validators.required])],
      tenantid: [data ? data.tenantid.trim() : '', Validators.compose([Validators.required])],
      address1: [data ? data.address1.trim() : '', Validators.compose([Validators.required])],
      address2: [data ? data.address2.trim() : ''],
      city: [data ? data.city.trim() : '', Validators.compose([Validators.required])],
      zipcode: [data ? data.zipcode.trim() : '', Validators.compose([Validators.required, Validators.compose([Validators.minLength(5), Validators.maxLength(5),Validators.pattern(this.validationService.number_regexPattern)])])],
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

    this.customerForm.valueChanges.subscribe(value => {
      this.errorMsz = '';
    })
  }

  initCSPForm(data?){
    this.cspCustomerForm = this.fb.group({
      companyname : [data ? data.companyname.trim() : '', Validators.compose([Validators.required])],      
      address1: [data ? data.address1.trim() : '', Validators.compose([Validators.required])],
      address2: [data ? data.address2.trim() : ''],
      city: [data ? data.city.trim() : '', Validators.compose([Validators.required])],
      zipcode: [data ? data.zipcode.trim() : '', Validators.compose([Validators.required, Validators.compose([Validators.minLength(5), Validators.maxLength(5),Validators.pattern(this.validationService.number_regexPattern)])])],
      countryid: [data ? data.countryid : '', Validators.compose([Validators.required])],
      stateid: [data ? data.stateid : '', Validators.compose([Validators.required])],
      logo : [''],
      headerHexCode : [data ? data.brandinginfo[0].headerHexCode : '', Validators.compose([Validators.minLength(6), Validators.maxLength(6)])],
      primaryButtonHexCode : [data ? data.brandinginfo[0].primaryButtonHexCode : '',Validators.compose([Validators.minLength(6), Validators.maxLength(6)])],
      activeFieldHexCode : [data ? data.brandinginfo[0].activeFieldHexCode : '',Validators.compose([Validators.minLength(6), Validators.maxLength(6)])],
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
    this.cspCustomerForm.valueChanges.subscribe(value => {
      this.errorMsz = '';
    })
  }

  customerType(event: any){
    this.customerTypeValue = event.target.value;
    if(this.customerTypeValue === 'DC') {
      this.customerForm.reset();
      this.initForm();
    } else {
      this.cspCustomerForm.reset();
      this.initCSPForm();
    }
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
        this.setUSDefault('cspCustomerForm','countryid',222);
        this.getStatesForCountry(222)
      }
    }, err => {
    })
  }

  getAllRoles(type?){
    this.customerService.getRoles(type).subscribe((res:any) => {
      if(!res.error){
        this.allRoles = res.data;
        if(this.type === 'add') {
          this.setRoleDefaultAdministrator('customerForm','users','roleid', 3)
          this.setRoleDefaultAdministrator('cspCustomerForm','users','roleid', 2)
        }
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
      this.removelogo = false;
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
    this.removelogo = true;
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

  openDeleteModal(formArray,index,obj) {
    const formBuilder = this.customerTypeValue === 'DC' ? 'customerForm' : 'cspCustomerForm'
    if(this.type == 'edit') {
      const modalRef = this.modalService.open(DeactivateEditUserComponent);
      modalRef.componentInstance.removeSelectedArray = {formBuilder:formBuilder,formArray:formArray,index:index,id:obj.value.id};
    } else {
      let getArray = this[formBuilder].controls[formArray] as FormArray;
      getArray.removeAt(index); 
      setTimeout(() => {
        this.utilService.setNavHeight('commonContainer')
      }, 100);
    }
  }
  
  submitCSP(){
    let addCspPostObj = this.cspCustomerForm.value;
    if(this.type === 'edit') {
      addCspPostObj['customerid'] = this.customerid
      addCspPostObj['removelogo'] = this.removelogo
    }
    this.customerService.addCSPCustomer(addCspPostObj,this.type).subscribe((res:any) => {
      const editCsp = 'CSP customer has been updated successfully.'
      const addCsp = 'CSP customer has been added successfully.'
      this.showToast(this.type === 'edit' ? editCsp:addCsp);
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
        if(res.data.brandinginfo[0].logoPath) {
          this.logoObj.fileUrl = res.data.brandinginfo[0].logoPath
        }
      }, err => {
        this.errorMsz = err && err.error ? err.error.message : '';
      })

    }
  }

  updateBtnColor () {
    this.btnColor.nativeElement.style.backgroundColor = this.utilService.primaryButtonHexCode;
  }

  restrictLeadingSpace(event) {
    let strInput = event.target.value;
    if (!strInput.length) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.customerService.removeArr('')
    this.destroySubscription$.next(true);
    this.deleteRow.unsubscribe();
  }

}

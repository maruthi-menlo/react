import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { UtilService } from '../shared/services/util.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../shared/services/customer.service';
import { DeactivateEditUserComponent } from '../core/modals/deactivate-edit-user/deactivate-edit-user.component';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ToastService } from '../shared/services/toaster.service';

@Component({
  selector: 'app-azure-subscriptions',
  templateUrl: './azure-subscriptions.component.html',
  styleUrls: ['./azure-subscriptions.component.scss']
})
export class AzureSubscriptionsComponent implements OnInit {

  azureSubscriptionForm: FormGroup;
  userDetailsObj: FormGroup;
  azureSubDetailsObj: FormGroup;
  errorMsz:string = '';
  customerTypeValue: any = 'DC';
  type:any = 'add';
  data:any;
  deleteRow:Subscription;
  destroySubscription$: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
    private utilService:UtilService,
    private modalService: NgbModal,
    private customerService:CustomerService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getSubscriptions();
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
  }

  addazureSubDetails(data?, idx?) {
    let formArray = this.azureSubscriptionForm.controls['azuresubscriptions'] as FormArray;
    formArray.push(this.fb.group({
      id: [data ? data.id : ''],
      subscriptionid: [data? data.subscriptionId: ''],
    }));
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  get azureSubDetails() {
    return this.azureSubscriptionForm.get('azuresubscriptions') as FormArray;
  }

  initForm(data?){
    this.azureSubscriptionForm = this.fb.group({
      azuresubscriptions: this.fb.array([ ])
    });
    [1].forEach(ele => {
      if(data && data.length){
        data.forEach((eachSubscriptionObj, index) => {    
          this.addazureSubDetails(eachSubscriptionObj, index);
        });
      }else{
        this.addazureSubDetails(null, null);
      }      
    })
    this.azureSubscriptionForm.valueChanges.subscribe(value => {
      this.errorMsz = '';
      setTimeout(() => {
        this.utilService.setNavHeight('commonContainer')
      }, 100);
    })
  }

  openDeleteModal(formArray,index,obj) {
    const formBuilder = 'azureSubscriptionForm';
    if(obj.value.id) {
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

  getSubscriptions() {
    this.customerService.getSubscriptions().subscribe((res:any) => {
      if(res.data) {
        this.initForm(res.data);
      }
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

  submit() {
    const editPostObj = this.azureSubscriptionForm.value;
    const subscriptionId = 'Subscription added successfully'
    this.customerService.updateSubscriptions(editPostObj).subscribe((res:any) => {
        const addSubscription = 'Subscription added successfully.'
        window.scrollTo(0,0);
        this.showToast(addSubscription);
        this.getSubscriptions();
    }, err => {
      this.errorMsz = err && err.error ? err.error.message : '';
    })
  }

  cancel() {

  }

  ngOnDestroy() {
    this.customerService.removeArr('')
    this.destroySubscription$.next(true);
    this.deleteRow.unsubscribe();
  }
  
}

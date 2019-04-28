import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DeactivatePlayaAccountModalComponent } from '../core/modals/deactivate-playa-account-modal/deactivate-playa-account-modal.component'
import { Router } from '@angular/router';
import { UtilService } from '../shared/services/util.service';
import { CustomerService } from '../shared/services/customer.service';
import { ToastService } from '../shared/services/toaster.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-customers-view',
  templateUrl: './customers-view.component.html',
  styleUrls: ['./customers-view.component.scss']
})

export class CustomersViewComponent implements OnInit {

  tableView: string = 'DC';
  cspTableView: any = false;
  closeResult: string;
  directCustomerArr: any = [];
  cspCustomerArr: any = [];
  page:Number = 1;
  totalCount:Number;
  pageSize:Number = 10;
  content: string;
  showReactive: boolean = false;
  public user : any;
  userRow:Subscription;
  destroySubscription$: Subject<boolean> = new Subject();
  userRole:any=null;

  constructor(
    public modalService: NgbModal,
    private router:Router,
    private utilService:UtilService,
    private customerService: CustomerService,
    private toastService: ToastService,
  ) { 
    this.customerService.user.subscribe((user)=>{
      if(user) {
        this.reloadTableView();
      }
    })
  }

  reloadTableView() {
    const deactivate = 'Customer Deactivated.'
    const reactivate = 'Customer Reactivated.'
    this.showToast(this.user.status ? deactivate:reactivate);
    const obj = {limit:10, pagenumber:+this.page-1};
    if(this.tableView === 'DC') {  
      if(this.utilService.userRole === 1) {
        this.getDCData(obj);        
      }else if(this.utilService.userRole === 2){
        this.getCSPDCData(obj);
      }       
    } else {
      this.getCSPData(obj);
    }
  }

  ngOnInit() {
    this.userRole = this.utilService.userRole;
    this.onChangeTable()
    this.getDataByRole()
    
  }

  onChangeTable() {
    this.userRow = this.customerService.user
    .pipe(takeUntil(this.destroySubscription$))
    .subscribe((user: any) => {
      if(user) {
        this.reloadTableView();
      }
    });
  }


  getDataByRole() {
    const obj = {limit:10, pagenumber:0}
    if(this.utilService.userRole === 1) {
      this.getDCData(obj);
      this.getCSPData(obj);
    }else if(this.utilService.userRole === 2){
      this.getCSPDCData(obj);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  onChangeTableView(type) {
    if(type !== this.tableView) {
      const obj = {limit:10, pagenumber:0}
      this.page = 1;
      type == 'DC' ? this.getDCData(obj) : this.getCSPData(obj)
      this.tableView = type;
      this.totalCount = this.tableView == 'DC' ? this.directCustomerArr.totalcount : this.cspCustomerArr.totalcount;
    }
  }

  getDCData(obj) {
    this.customerService.getDCData(obj).subscribe((res:any) => {
      if(!res.error){
        this.directCustomerArr = res && res.data ? res : [];
        this.totalCount = res.totalcount
      }
    }, err => {
    })
  }

  getCSPDCData(obj) {
    this.customerService.getCSPDCData(obj).subscribe((res:any) => {
      if(!res.error){
        this.directCustomerArr = res && res.data ? res : [];
        this.totalCount = res.totalcount
      }
    }, err => {
    })
  }

  getCSPData(obj) {
    this.customerService.getCSPData(obj).subscribe((res:any) => {
      if(!res.error){
        this.cspCustomerArr = res && res.data ? res : []
      }
    }, err => {
    })
  }

  showToast(message) {
    this.toastService.show({
      text: message,
      type: 'success',
    });
  }

  openDeactivateModal(user) {
   this.user = user;
   const modalRef = this.modalService.open(DeactivatePlayaAccountModalComponent);
   modalRef.componentInstance.user = this.user;
   
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

  navigateToaddCustomerPage(type,data){
    if(data && data.id){
      const url = `/editcustomer/${type}`
      this.router.navigate([url],{ queryParams: {id: data.id}});
    }
  }

  navigate() {
    const url = this.tableView === 'DC' ? '/addcustomer' : '/addcsp'
    this.router.navigate([url]);
  }

  loadPage(page: number) {
      this.page = page;
      const obj = {limit:10, pagenumber:page-1}
      this.tableView == 'DC' ? this.getDCData(obj) : this.getCSPData(obj)
  }

  ngOnDestroy() {
    this.customerService.deleteUser('')
    this.destroySubscription$.next(true);
    this.userRow.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DeactivatePlayaAccountModalComponent } from '../core/modals/deactivate-playa-account-modal/deactivate-playa-account-modal.component'
import { Router } from '@angular/router';
import { UtilService } from '../shared/services/util.service';
import { CustomerService } from '../shared/services/customer.service';

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

  constructor(
    private modalService: NgbModal,
    private router:Router,
    private utilService:UtilService,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.getDCData();
    this.getCSPData();
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer')
  }

  onChangeTableView() {
    this.tableView = this.tableView == 'DC' ? 'CSP' : 'DC'
  }

  getDCData() {
    const obj = {limit:10, pagenumber:0}
    this.customerService.getDCData(obj).subscribe((res:any) => {
      if(!res.error){
        this.directCustomerArr = res && res.data ? res.data : []
      }
    }, err => {
    })
  }

  getCSPData() {
    const obj = {limit:10, pagenumber:0}
    this.customerService.getCSPData(obj).subscribe((res:any) => {
      if(!res.error){
        this.cspCustomerArr = res && res.data ? res.data : []
      }
    }, err => {
    })
  }

  openDeactivateModal(content) {
    this.modalService.open(DeactivatePlayaAccountModalComponent,{ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'customDeactivateModal'}).result.then((result) => {
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

  navigateToaddCustomerPage(type){
    let url = `/addcustomer/${type}`
    this.router.navigate([url]);
  }

  navigate() {
    this.router.navigate(['/addcustomer']);
  }

}

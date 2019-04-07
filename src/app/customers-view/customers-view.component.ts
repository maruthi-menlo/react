import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DeactivatePlayaAccountModalComponent } from '../core/modals/deactivate-playa-account-modal/deactivate-playa-account-modal.component'
import { Router } from '@angular/router';
import { UtilService } from '../shared/services/util.service';

@Component({
  selector: 'app-customers-view',
  templateUrl: './customers-view.component.html',
  styleUrls: ['./customers-view.component.scss']
})
export class CustomersViewComponent implements OnInit {

  dcTableView: any = true;
  cspTableView: any = false;
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private router:Router,
    private utilService:UtilService
  ) { }

  ngOnInit() {
    // this.dcTableView();
    // this.cspTableViewShow();
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer')
  }

  dcTableViewShow(){
    this.dcTableView = true;
    this.cspTableView = false;
  }
  cspTableViewShow(){
    this.dcTableView = false;
    this.cspTableView = true;
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

  navigateToaddCustomerPage(){
    this.router.navigate(['/addcustomer']);
  }

}

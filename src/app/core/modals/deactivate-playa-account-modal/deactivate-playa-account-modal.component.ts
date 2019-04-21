import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../../../shared/services/customer.service'
 

@Component({
  selector: 'app-deactivate-playa-account-modal',
  templateUrl: './deactivate-playa-account-modal.component.html',
  styleUrls: ['./deactivate-playa-account-modal.component.scss']
})

export class DeactivatePlayaAccountModalComponent implements OnInit {
  
  data : any;
  @Input() public user;
  @Output() userDeleted: EventEmitter<any> = new EventEmitter();
  httpClient: any;

  constructor(
    public modal:NgbActiveModal,
    public customerService : CustomerService
  ) { }

  ngOnInit() { }

  removeSubscription(){
    const postObj = {'customerid':this.user.id,'status':this.user.status ? 0:1}
    this.customerService.updateStatusCustomer(postObj).subscribe(data  => {
      this.modal.close();
      this.customerService.deleteUser(this.user)
    });
  }

}

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../../../shared/services/customer.service';
import { ToastService } from '../../../shared/services/toaster.service';

@Component({
  selector: 'app-deactivate-edit-user',
  templateUrl: './deactivate-edit-user.component.html',
  styleUrls: ['./deactivate-edit-user.component.scss']
})
export class DeactivateEditUserComponent implements OnInit {

  @Input() public removeSelectedArray;
  httpClient: any;

  constructor(
    public modal:NgbActiveModal,
    public customerService : CustomerService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
  }

  removeArray(){
    if(this.removeSelectedArray.id) {
      let postObj = {}
      if(this.removeSelectedArray.formArray == "users") {
        postObj['userid'] = this.removeSelectedArray.id
      } else {
        postObj['subscriptionid'] = this.removeSelectedArray.id
      }
      this.customerService.removeUserOrSubscription(postObj,this.removeSelectedArray.formArray).subscribe(data  => {
        const removeUser = 'User removed successfully.'
        const removeSubscription = 'Subscription removed successfully.'
        this.closeModal()
        this.showToast(this.removeSelectedArray.formArray == 'users' ? removeUser:removeSubscription);
      });
    } else {
      this.closeModal()
    }
    window.scrollTo(0,0);
  }

  showToast(message) {
    this.toastService.show({
      text: message,
      type: 'success',
    });
  }

  closeModal() {
    this.modal.close();
    this.customerService.removeArr(this.removeSelectedArray)
  }

}

import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deactivate-playa-account-modal',
  templateUrl: './deactivate-playa-account-modal.component.html',
  styleUrls: ['./deactivate-playa-account-modal.component.scss']
})
export class DeactivatePlayaAccountModalComponent implements OnInit {

  constructor(
    public modal:NgbActiveModal
  ) { }

  ngOnInit() {
  }


}

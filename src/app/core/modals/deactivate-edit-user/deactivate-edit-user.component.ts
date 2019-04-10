import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deactivate-edit-user',
  templateUrl: './deactivate-edit-user.component.html',
  styleUrls: ['./deactivate-edit-user.component.scss']
})
export class DeactivateEditUserComponent implements OnInit {

  constructor(
    public modal:NgbActiveModal
  ) { }

  ngOnInit() {
  }

}

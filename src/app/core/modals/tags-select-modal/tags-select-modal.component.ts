import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tags-select-modal',
  templateUrl: './tags-select-modal.component.html',
  styleUrls: ['./tags-select-modal.component.scss']
})
export class TagsSelectModalComponent implements OnInit {

  constructor(public modal:NgbActiveModal) { }

  ngOnInit() {
  }

}

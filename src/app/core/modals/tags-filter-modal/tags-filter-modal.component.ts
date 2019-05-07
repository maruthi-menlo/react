import { Component, OnInit} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateStruct, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tags-filter-modal',
  templateUrl: './tags-filter-modal.component.html',
  styleUrls: ['./tags-filter-modal.component.scss']
})
export class TagsFilterModalComponent implements OnInit {
  model: NgbDateStruct;
  startDate:any;
  endDate:any;
  constructor( public modal:NgbActiveModal,private calendar: NgbCalendar) {
  }

  ngOnInit() {
  }

  close(){
    this.modal.close();
  }
  removeSubscription(){
    
  }
}

import { Component, OnInit } from '@angular/core';
import {UtilService} from '../shared/services/util.service'


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  userRole:any;
  constructor(
    private utilService:UtilService
  ) { }

  ngOnInit() {
    this.userRole = this.utilService.userRole;
  }

}

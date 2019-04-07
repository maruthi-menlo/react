import { Component, OnInit } from '@angular/core';
import { UtilService } from '../shared/services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-playa-admin',
  templateUrl: './edit-playa-admin.component.html',
  styleUrls: ['./edit-playa-admin.component.scss']
})
export class EditPlayaAdminComponent implements OnInit {

  constructor(
    private utilService:UtilService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.utilService.setNavHeight('commonContainer')
  }

  cancel(){
    this.router.navigate(['/customersview']);
  }
}

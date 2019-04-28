import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/services/customer.service';
import {AuthService} from '../auth/auth.service';
import {UtilService} from '../shared/services/util.service'
import * as $ from "jquery";
declare var powerbi: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  reportId: any;
  embedUrl: any;
  embedToken: any;
  values:any;
  userRole:any;

  constructor(
    private customerService: CustomerService,
    private authService:AuthService,
    private utilService:UtilService
  ) { }

  ngOnInit() {
    this.userRole = this.utilService.userRole;
    this.getParamasPowerbi()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilService.setNavHeight('commonContainer')
    }, 100);
  }

  loadPowerBi() {
    const models = window['powerbi-client'].models;

    const myFilter = {
      $schema: "http://powerbi.com/product/schema#advanced",
      target: {
        table: "vwAUsageDetails",
        column: "CustomerName"
      },
      operator: "In",
      values: this.values
    }

    const config = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: this.embedToken,
      embedUrl: this.embedUrl,
      id: this.reportId,
      filters: [myFilter],
      permissions: models.Permissions.Read,
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: true
      }
    }

    // Get a reference to the embedded dashboard HTML element 
    const reportContainer = $('#reportContainer')[0];
    // Embed the dashboard and display it within the div container. 
    powerbi.embed(reportContainer, config)
  }

  getParamasPowerbi() {
    this.customerService.getParamasPowerbi().subscribe((res: any) => {
      this.embedToken = res.embedToken;
      this.embedUrl = res.embedUrl;
      this.reportId = res.reportId;
      const user = this.authService.getCurrentUser;
      this.values = user['customers'];
      this.loadPowerBi()
    }, err => {

    })
  }


}

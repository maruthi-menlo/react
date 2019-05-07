import { Component, OnInit, Input } from '@angular/core';
import {UtilService} from '../shared/services/util.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { browserRefresh } from '../app.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  userRole:any;
  public browserRefresh: boolean;

  @Input() showSubHeader:boolean;

  constructor(
    private utilService:UtilService,
    private router:Router,
  ) { 
    // router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationEnd) {
    //     if(event.url.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/updatepassword') > -1 || event.urlAfterRedirects.indexOf('/forgotpassword') > -1 || event.urlAfterRedirects.indexOf('/resetpassword') > -1 ) {
    //       this.showsecondaryNavbar = false
    //     } else {
    //       this.showsecondaryNavbar = true
    //     }
    //   }
      
    // });
  }

  ngOnInit() {
    this.userRole = this.utilService.userRole;
    this.browserRefresh = browserRefresh;
    /*If refresh button is clicked in tags component then secondaryMenu is hidden*/
    if(this.browserRefresh == true){
      this.showSubHeader = false;
    }
  }

  tagsClick(){
    this.showSubHeader = false;
  }
  azureClick(){
    this.showSubHeader = true;
  }

}

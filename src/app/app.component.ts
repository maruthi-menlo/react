import { Component, OnInit,HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UtilService } from './shared/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Playa';
  loginRoute:boolean = true
  showSubHeader: boolean;
 

  constructor(
    private router: Router,
    private utilService:UtilService
  ) {

    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if(event.url.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/updatepassword') > -1 || event.urlAfterRedirects.indexOf('/forgotpassword') > -1
      || event.urlAfterRedirects.indexOf('/resetpassword') > -1 ) {
        this.loginRoute = true
        } else {
          this.loginRoute = false;
          if(event.url.indexOf('/dashboard') > -1) {
            this.showSubHeader = false;
          } else {
            this.showSubHeader = true;
          }
        }
      }
      
    });
  }

  ngOnInit() {
  }

  @HostListener('window:click', ['$event.target'])
  onClick(targetElement: any) {
    if(targetElement.className.indexOf('form-control') > -1) {
      targetElement.style.border = this.utilService.activeFieldHexCode;
    }
  }
}
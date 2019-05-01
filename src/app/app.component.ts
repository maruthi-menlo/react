import { Component, OnInit,HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UtilService } from './shared/services/util.service';
import { AuthService } from './auth/auth.service';

declare var jQuery:any;
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
    private utilService:UtilService,
    private authService:AuthService
  ) {

    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if(event.url.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/updatepassword') > -1 || event.urlAfterRedirects.indexOf('/forgotpassword') > -1
      || event.urlAfterRedirects.indexOf('/resetpassword') > -1 ) {
        this.loginRoute = true
        } else {
          this.isAuthenticated();
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

  restrictLeadingSpace(event) {
    let strInput = event.target.value;
    if (!strInput.length) {
      event.preventDefault();
    }
  }

  // @HostListener('window:click', ['$event.target'])
  // onClick(targetElement: any) {
  //   jQuery('.form-control').css('border','1px solid rgba(0,0,0,.5)');
  //   if(targetElement.className.indexOf('form-control') > -1) {
  //     targetElement.style.border = this.utilService.activeFieldHexCode;
  //   }
  // }

  isAuthenticated() {
    if(this.authService.getCurrentUser == null) {
      this.authService.logout;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 100);
    }
  }
}
import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { forkJoin, Subject, Subscription } from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import { takeUntil, filter } from 'rxjs/operators';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  afterLogin:any = true;
  showProfile:boolean = false;
  showFixedHeader:boolean = false;
  userProfileObj: any = {};
  loggedInSubscription: Subscription;
  destroySubscription$: Subject<boolean> = new Subject();
  userRole:any=null;
  logo:any= null;
  headerHexCode:any;
  @ViewChild('headerBGColor') headerBGColor; 

  constructor(
    private router:Router,
    private authService:AuthService,
    private utilService:UtilService
  ) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if(event.url.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/updatepassword') > -1 || event.urlAfterRedirects.indexOf('/forgotpassword') > -1 || event.urlAfterRedirects.indexOf('/resetpassword') > -1 ) {
          if(event.url.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/login') > -1){
            this.showFixedHeader = true;
          }else{
            this.showFixedHeader = false;
          }
          this.showProfile = false
        } else {
          this.showFixedHeader = false;
          this.showProfile = true
        }
      }
      
    });
  }

  ngOnInit() {    
    this.updateHeader();
    this.loggedInSubscription = this.authService.loggedIn$
    .pipe(takeUntil(this.destroySubscription$))
    .subscribe((state: any) => {
      this.userRole = this.utilService.userRole;
      if (state) {
        if (state.loggedIn) {
          this.userProfileObj = this.authService.getCurrentUser;
        } else {
          this.userProfileObj = null;
        }
        this.updateHeader();
      }
    });
  }

  logout() {
    this.authService.logout(401);
    this.updateHeader();
  }

  dashboard() {
    const role = this.utilService.userRole
    if(role === 3){
      this.router.navigate(['/azuresubscriptions']);
    }else if(role === 4){
      this.router.navigate(['/editplayaprofile']);
    } else if (role === 1 || role === 2) {
      this.router.navigate(['/customersview']);
    }
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
    this.loggedInSubscription.unsubscribe();
  }

  updateHeader() {
    this.logo = this.utilService.brandingLogo;
    this.headerBGColor.nativeElement.style.backgroundColor = this.utilService.headerHexCode;
  }

}

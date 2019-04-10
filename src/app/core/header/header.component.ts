import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { forkJoin, Subject, Subscription } from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  afterLogin:any = true;
  showProfile:boolean = false;
  userProfileObj: any = {};
  loggedInSubscription: Subscription;
  destroySubscription$: Subject<boolean> = new Subject();

  constructor(
    private router:Router,
    private authService:AuthService,
  ) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if(event.url.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/updatepassword') > -1 ) {
          this.showProfile = false
        } else {
          this.showProfile = true
        }
      }
      
    });
  }

  ngOnInit() {
    this.loggedInSubscription = this.authService.loggedIn$
    .pipe(takeUntil(this.destroySubscription$))
    .subscribe((state: any) => {
      if (state) {
        if (state.loggedIn) {
          this.userProfileObj = this.authService.getCurrentUser;
        } else {
          this.userProfileObj = null;
        }
      }
    });
  }

  logout() {
    this.authService.logout(401);
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
    this.loggedInSubscription.unsubscribe();
  }

}

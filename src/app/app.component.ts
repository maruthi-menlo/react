import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Playa';
  loginRoute:boolean = false
 

  constructor(
    private router: Router
  ) {

    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if(event.url.indexOf('/login') > -1 || event.urlAfterRedirects.indexOf('/login') > -1) {
          this.loginRoute = true
        } else {
          this.loginRoute = false
        }
      }
      
    });
  }

  ngOnInit() {
  }
}
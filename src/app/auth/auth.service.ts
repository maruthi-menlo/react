import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UtilService } from '../shared/services/util.service';
import { httpUrls as urls } from '../shared/data-models/httpUrls';
import { BehaviorSubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api_url = `${environment.BASE_API}${environment.API}`;
  userProfile: any;;
  userToken: any;
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  constructor(
    private http: HttpClient,
    private router: Router,
    private utilService: UtilService
  ) {
    if (this.getToken) {
      this.userProfile = this.getCurrentUser;
      this.setLoggedIn({ loggedIn: true });
    }
  }



  login(data) {
    let url = `${this.api_url}${urls.LOGIN}`;
    return this.http.post(url, data)
    .pipe(catchError(this.utilService.handleError)); 
  }

  get getCurrentUser() {
    const user = localStorage.getItem('profile');
    return user ? JSON.parse(user) : null;
  }

  setLoggedIn(value: any) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  get isLoggedIn() {
    return this.loggedIn$.asObservable();
  }

  logout(status?) {
    // Reset local properties, update loggedIn$ stream
    this.userProfile = undefined;
    this.setLoggedIn({ loggedIn: false });
    localStorage.clear();
    // Return to homepage
    if (status == 401) {
      this.router.navigate(['/']);
    }
  }

  _setSession(accessToken, profile, type?) {
    // Save session data and update login status subject
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.userToken = accessToken;
    this.userProfile = profile;
    // Update login status in loggedIn$ stream
    this.setLoggedIn({ loggedIn: true });
  }
  
  get getToken(): string {
    // Check if current time is past access token's expiration
    const token = localStorage.getItem('access_token');
    return token ? token : '';
  }


}

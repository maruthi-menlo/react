import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.isLoggedIn
      .pipe(take(1))
      .pipe(map((isLoggedIn: any) => {
        if (next.queryParams && next.queryParams['token']) {
          this.authService.logout();
          return true;
        } else {
          if (isLoggedIn && isLoggedIn.loggedIn) {
            this.router.navigate(['/addcustomer']);
            return false;
          }
        }
        return true;
      }));
  }
}

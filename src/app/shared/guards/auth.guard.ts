import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.getToken) {
      this.router.navigate(['/login']);
      return false;
    } else if ((next.routeConfig.path && next.routeConfig.path.trim() == "") || state && (state.url.trim() == "/" || state.url.trim() == "")) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

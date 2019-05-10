import { Injectable } from '@angular/core';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserRolesService } from './user-roles.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, public userRolesService: UserRolesService) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated) {
      this.router.navigate(['login']);
      return false;
    }


    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          if (this.auth.getCurrentUser) {
            if (this.auth.getCurrentUser.roleid === 1) {
              if (this.userRolesService.getRoleId1_roles().indexOf(this.router.url.toString()) === -1) {
                this.router.navigate(['customersview']);
                return false;
              }
            } else if (this.auth.getCurrentUser.roleid === 2) {
              if (this.userRolesService.getRoleId2_roles().indexOf(this.router.url.toString()) === -1) {
                this.router.navigate(['customersview']);
                return false;
              }
            } else if (this.auth.getCurrentUser.roleid === 3) {
              if (this.userRolesService.getRoleId3_roles().indexOf(this.router.url.toString()) === -1) {
                this.router.navigate(['azuresubscriptions']);
                return false;
              }
            } else if (this.auth.getCurrentUser.roleid === 4) {
              if (this.userRolesService.getRoleId4_roles().indexOf(this.router.url.toString()) === -1) {
                this.router.navigate(['editplayaprofile']);
                return false;
              }
            }
          }
        }
      });

    return true;
  }
}

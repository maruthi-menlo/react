import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {
  constructor( ) { }
  roleId1: string[] = ['/editplayaprofile', '/customersview', '/addcustomer'];
  roleId2: string[] = ['/dashboard', '/editplayaprofile', '/customersview', '/addcustomer'];
  roleId3: string[] = ['/azuresubscriptions', '/tags', '/dashboard', '/editplayaprofile'];
  roleId4: string[] = ['/tags', '/dashboard', '/editplayaprofile'];
  getRoleId1_roles() {
    return this.roleId1;
  }
  getRoleId2_roles() {
    return this.roleId2;
  }

  getRoleId3_roles() {
    return this.roleId3;
  }
  getRoleId4_roles() {
    return this.roleId3;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpUrls as urls } from '../data-models/httpUrls';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  api_url = `${environment.BASE_API}${environment.API}`;
  private userDelete = new BehaviorSubject('');
  user = this.userDelete.asObservable();


  constructor(
    private http: HttpClient,
    private route:ActivatedRoute,
  ) { }

  deleteUser(user: any) {
    this.userDelete.next(user)
  }


  getCountries() {
    let url = `${this.api_url}${urls.COUNTRIES}`;
    return this.http.get(url)
  }

  getCountryStates(id) {
    const data = {"countryid": id }
    let url = `${this.api_url}${urls.STATES}`;
    return this.http.post(url, data)
  }

  getRoles(type){
    let url = type === 'DC' ? `${this.api_url}${urls.DC_ROLES}` : `${this.api_url}${urls.CSP_ROLES}`;;
    return this.http.get(url)
  }

  addCustomer(data,type) {
    let url = type === 'add' ? `${this.api_url}${urls.ADD_DIRECT_CUSTOMER}` : `${this.api_url}${urls.UPDATE_DIRECT_CUSTOMER}`;
    return this.http.post(url, data)
  }

  createPassword(data) {
    let url = `${this.api_url}${urls.CREATE_PASSWORD}`;
    return this.http.post(url, data)
  }
  
  deactivateUser(data){
    let url = `${this.api_url}${urls.DEACTIVATE_CSP_DIRECT_USERS}`;
    return this.http.post(url,data);
  }

  updateStatusCustomer(data){
    let url = `${this.api_url}${urls.UPDATE_USER_STATUS}`;
    return this.http.post(url,data);
  }

  addCSPCustomer(data,type?) {
    let formData:any = new FormData();
    formData.append('companyname',data.companyname )
    formData.append('address1',data.address1 )
    formData.append('address2',data.address2)
    formData.append('city',data.city)
    formData.append('zipcode',data.zipcode)
    formData.append('countryid',data.countryid)
    formData.append('stateid',data.stateid)
    formData.append('logo',data.logo)
    formData.append('headerHexCode',data.headerHexCode ? data.headerHexCode:'')
    formData.append('primaryButtonHexCode',data.primaryButtonHexCode ? data.primaryButtonHexCode:'')
    formData.append('activeFieldHexCode',data.activeFieldHexCode ? data.activeFieldHexCode:'')
    formData.append('customerid',data.customerid ? data.customerid:'')
    formData.append('users',JSON.stringify(data.users))
    let url = type === 'add' ? `${this.api_url}${urls.ADD_CSP_CUSTOMER}` : `${this.api_url}${urls.UPDATE_CSP_CUSTOMER}`;
    return this.http.post(url, formData)
  }

  getDCData(obj) {
    let url = `${this.api_url}${urls.GET_DC_DATA}`;
    return this.http.post(url,obj)
  }

  getCSPData(obj) {
    let url = `${this.api_url}${urls.GET_CSP_DATA}`;
    return this.http.post(url,obj)
  }

  getDCUserData(obj) {
    let url = `${this.api_url}${urls.GET_DC_USER_DATA}`; 
    return this.http.post(url,obj)
  }

  getCSPUserData(obj) {
    let url = `${this.api_url}${urls.GET_CSP_USER_DATA}`; 
    return this.http.post(url,obj)
  }

  editPlayaUserData(obj) {
    let url = `${this.api_url}${urls.EDIT_PLAYA_USER_DATA}`; 
    return this.http.post(url,obj)
  }

  get getCustomerId() {
    let id;
    this.route.queryParams.subscribe(params => {
      if(params && params.id) {
        id =  params.id
      }
    });
    return id ? id : null;
  }

}
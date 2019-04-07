import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { httpUrls as urls } from '../data-models/httpUrls';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  api_url = `${environment.BASE_API}${environment.API}`;
  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) { }

  getCountries() {
    let url = `${this.api_url}${urls.COUNTRIES}`;
    return this.http.get(url)
  }

  getCountryStates(id) {
    const data = {"countryid": id }
    let url = `${this.api_url}${urls.STATES}`;
    return this.http.post(url, data)
  }

  getRoles(){
    let url = `${this.api_url}${urls.ROLES}`;
    return this.http.get(url)
  }

  addCustomer(data) {
    let url = `${this.api_url}${urls.DIRECT_CUSTOMER}`;
    return this.http.post(url, data)
  }

  createPassword(data) {
    let url = `${this.api_url}${urls.CREATE_PASSWORD}`;
    return this.http.post(url, data)
  }

  addCSPCustomer(data) {
    let formData:any = new FormData();
    formData.append('companyname ',data.companyname )
    formData.append('address1 ',data.address1 )
    formData.append('address2',data.address2)
    formData.append('city',data.city)
    formData.append('zipcode',data.zipcode)
    formData.append('countryid',data.countryid)
    formData.append('stateid',data.stateid)
    formData.append('logo',data.logo)
    formData.append('headerHexCode',data.headerHexCode)
    formData.append('primaryButtonHexCode',data.primaryButtonHexCode)
    formData.append('activeFieldHexCode',data.activeFieldHexCode)
    formData.append('users',JSON.stringify(data.users))
    let url = `${this.api_url}${urls.CSP_Customer}`;
    return this.http.post(url, formData)
  }
}